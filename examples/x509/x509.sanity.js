const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const x509 = require("@peculiar/x509");
const jose = require('jose')

// https://github.com/PeculiarVentures/x509
x509.cryptoProvider.set(crypto);

const xt5 = (hash, cert) => jose.base64url.encode(crypto.createHash(hash).update(Buffer.from(cert, 'base64')).digest())

const verifyCertificateChain = async ({alg, x5c}, date = new Date())=> {
  const initialValue = {}
  const accumulated = await x5c.reduce(
    async (accumulator, currentValue, currentIndex) => {
      const next = await accumulator;
      const current =  new x509.X509Certificate(currentValue)
      const currentPublicKey = await jose.importX509(current.toString(), alg)
      const currentPublicKeyJwk = await jose.exportJWK(currentPublicKey)
      currentPublicKeyJwk.alg = alg
      currentPublicKeyJwk.kid = await jose.calculateJwkThumbprintUri(currentPublicKeyJwk)
      // sha1 bad....
      currentPublicKeyJwk.x5t = xt5('sha1', currentValue);
      // same as....
      // currentPublicKeyJwk.x5t = await jose.base64url.encode(await current.getThumbprint())
      // sha256 ok for now....
      currentPublicKeyJwk['x5t#S256'] = xt5('sha256', currentValue);
      // maintain x5c as we progress...
      currentPublicKeyJwk.x5c = x5c.slice(currentIndex, x5c.length)
      next.keys = next.keys || [currentPublicKeyJwk]
      // first key 
      if (next.previous === undefined) {
        next.previous = currentValue;
      } else {
        const previous = new x509.X509Certificate(next.previous) 
        const verified = await previous.verify({
          date, // verify as of date... defaults to now...
          publicKey: await current.publicKey.export() // root public key
        });
        if (verified){
          next.keys.push(currentPublicKeyJwk)
          next.previous = currentValue;
        } else {
          throw new Error('Failed to verify x5c.')
        }
      }
      return next
    },
    initialValue
  );
  const root = new x509.X509Certificate(accumulated.previous)
  const rootValid = await root.verify({ date });
  const isSelfSigned = await root.isSelfSigned()
  if (!isSelfSigned){
    throw new Error('Root certificate must be self signed.')
  }
  if (!rootValid){
    throw new Error('Root certificate failed to verify.')
  }
  delete accumulated.previous;
  return accumulated
}

(async ()=>{
  const extractable = true
  const alg = {
    name: "ECDSA",
    hash: "SHA-384",
    namedCurve: "P-384",
  };
  const caKeys = await crypto.subtle.generateKey(alg, extractable, ["sign", "verify"]);
  const caCert = await x509.X509CertificateGenerator.create({
    serialNumber: "01",
    subject: "CN=Test CA",
    issuer: "CN=Test CA",
    notBefore: new Date("2020/01/01"),
    notAfter: new Date("2020/01/03"),
    signingAlgorithm: alg,
    publicKey: caKeys.publicKey,   // self signed
    signingKey: caKeys.privateKey, // self signed
    extensions: [
      new x509.SubjectAlternativeNameExtension([
        { 
          type: 'guid', value: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6' 
        },
        { 
          type: 'url', value: 'did:web:root.transparency.example' 
        },
      ]),
      await x509.SubjectKeyIdentifierExtension.create(caKeys.publicKey)
    ]
  });
  const userKeys = await crypto.subtle.generateKey(alg, extractable, ["sign", "verify"]);
  const userCert = await x509.X509CertificateGenerator.create({
    serialNumber: "01",
    subject: "CN=Test",
    issuer: caCert.issuer,
    notBefore: new Date("2020/01/01"),
    notAfter: new Date("2020/01/02"),
    signingAlgorithm: alg,
    publicKey: userKeys.publicKey, // leaf public key
    signingKey: caKeys.privateKey, // root private key
    extensions: [
      new x509.SubjectAlternativeNameExtension([{ type: 'url', value: 'did:web:issuer.key.transparency.example' }]),
      await x509.SubjectKeyIdentifierExtension.create(userKeys.publicKey)
    ]
  });

  // prepare cert chain
  const chain = new x509.X509ChainBuilder({
    certificates: [
      caCert,
    ],
  });
  const items = await chain.build(userCert);
  const x5c = items.map((cert)=>{
    return cert.toString('base64')
  })

  // export use keys as jwks with cert chain
  const ecPublicKey = await jose.importX509(userCert.toString(), 'ES384')
  const userPublicKeyJwk = await jose.exportJWK(ecPublicKey)
  userPublicKeyJwk.kid = await jose.calculateJwkThumbprintUri(userPublicKeyJwk)
  userPublicKeyJwk.alg = 'ES384'
  userPublicKeyJwk.x5c = x5c

  // any URL... really?
  const userX5u = 'did:web:issuer.key.transparency.example/certs'

  const jwt = await new jose.SignJWT({ 'urn:example:claim': true })
    .setProtectedHeader({ alg: 'ES384', kid:userPublicKeyJwk.kid,  x5u: userX5u })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setExpirationTime('2h')
    .sign(await jose.importJWK(await jose.exportJWK(userKeys.privateKey)))

  // ... could also support jku ...
  // const jwks = jose.createRemoteJWKSet(new URL(decodedProtectedHeader.jku)
  // pretend to discover x5c from x5u at a specific time...
  const userX5c = userPublicKeyJwk.x5c
  const discoveryTime = new Date("2020/01/01 12:00")
  const jwks = await verifyCertificateChain({ x5c: userX5c }, discoveryTime)
  // root is still valid, as of the date provided, but do we still trust the root?
  // root is the last cert in the last jwk
  // const lastKey = jwks.keys[jwks.keys.length-1]
  // const lastCert = lastKey.x5c[lastKey.x5c.length -1]
  // const root =  new x509.X509Certificate(lastCert)
  // const sans = await root.getExtension('2.5.29.17').names.items.map((san)=>{
  //   return {[san.type]: san.value}
  // })
  // console.log(root.issuerName.toString())
  // console.log(await root.isSelfSigned())
  // console.log(sans)
  // CN=Test CA
  // true
  // [
  //   { guid: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6' },
  //   { url: 'did:web:root.transparency.example' }
  // ]
  
  // first cert was used to sign the token (kid thumbprint ensures this)
  // ✅ https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.6
  const { payload, protectedHeader } = await jose.jwtVerify(jwt, jose.createLocalJWKSet(jwks), {
    issuer: 'urn:example:issuer',
  })

  console.log(JSON.stringify({
    jwks,
    payload, 
    protectedHeader
  }, null, 2))
  // {
  //   "jwks": {
  //     "keys": [
  //       {
  //         "kty": "EC",
  //         "x": "lrdqFQUPTvCuggV7mEkky7ndNgxdj8dKpPmZf5sZECfx9N7lJdT_7Mr6QTL2dMJC",
  //         "y": "otE4pq1PAZgBl-S2m4XFYWGJP9vRUqT6Z7flbOK6ezJ4jUq82hiTOAUdXtirY45h",
  //         "crv": "P-384",
  //         "kid": "urn:ietf:params:oauth:jwk-thumbprint:sha-256:XiwJN7HGPnxsE7oZCp0TDHvTXhb9hlS3JESM_OgshCU",
  //         "x5t": "c0zx6o3Q06QGS3l4pJr9fVdnIJM",
  //         "x5t#S256": "QysS05UAG5kPwY-54CJsLgXa1Siw_iMraDl0pKNoBfk",
  //         "x5c": [
  //           "MIIBjTCCARWgAwIBAgIBATAKBggqhkjOPQQDAzASMRAwDgYDVQQDEwdUZXN0IENBMB4XDTIwMDEwMTA2MDAwMFoXDTIwMDEwMjA2MDAwMFowDzENMAsGA1UEAxMEVGVzdDB2MBAGByqGSM49AgEGBSuBBAAiA2IABJa3ahUFD07wroIFe5hJJMu53TYMXY/HSqT5mX+bGRAn8fTe5SXU/+zK+kEy9nTCQqLROKatTwGYAZfktpuFxWFhiT/b0VKk+me35WziunsyeI1KvNoYkzgFHV7Yq2OOYaNCMEAwHwYDVR0RBBgwFoYUZGlkOndlYjp1c2VyLmV4YW1wbGUwHQYDVR0OBBYEFKeGnjVTthYPWSwrRqjUbn2ozldUMAoGCCqGSM49BAMDA2YAMGMCLwfgT/HikgwK8cZRhCp+fXKTwzFSl5Dx2BJC4zSbjIett1gqxd+td6rAHbbg3zgIAjARruuhUvewrjbSaH2vn0/iqRJh6ZyTjs71wS4yBU5fOwrwSkIEo6C61TD+S78hJeE=",
  //           "MIIBszCCATmgAwIBAgIBATAKBggqhkjOPQQDAzASMRAwDgYDVQQDEwdUZXN0IENBMB4XDTIwMDEwMTA2MDAwMFoXDTIwMDEwMzA2MDAwMFowEjEQMA4GA1UEAxMHVGVzdCBDQTB2MBAGByqGSM49AgEGBSuBBAAiA2IABE8ti3nRQKdY6hBXmGSxevaMV9ewgDQXeUngy8QHIgZBCaPUa3hEH8tc0y63R1zOOVN8uBm/2D4IIBv9vXs0hwSw4+21QqkWe9nbjwNRY1Lxq7DJdSuS5iCvabOBrrZuZKNjMGEwQAYDVR0RBDkwN6AfBgkrBgEEAYI3GQGgEgQQrk8d+Ox90BGnZQCgyR5r9oYUZGlkOndlYjpyb290LmV4YW1wbGUwHQYDVR0OBBYEFK59YgT442T7B2q2tKLZRA2zS7U0MAoGCCqGSM49BAMDA2gAMGUCMQCwtJKXlglLeHoyW5gcqaJiWrXlnGBZIZt8eVG5mgOFtf+gQiyEpaV/NSZzZoJTprACMBTTTMZuEAc6KiOBYcKbfNJoYckp774AhUuWlartVA8oeW88HcVq/mGo4Hb/4C1P3Q=="
  //         ]
  //       },
  //       {
  //         "kty": "EC",
  //         "x": "Ty2LedFAp1jqEFeYZLF69oxX17CANBd5SeDLxAciBkEJo9RreEQfy1zTLrdHXM45",
  //         "y": "U3y4Gb_YPgggG_29ezSHBLDj7bVCqRZ72duPA1FjUvGrsMl1K5LmIK9ps4Gutm5k",
  //         "crv": "P-384",
  //         "kid": "urn:ietf:params:oauth:jwk-thumbprint:sha-256:A87jsJt0rMYfk-mfB5tG_RLyjxe3wsCfsJ1mq55Kxg4",
  //         "x5t": "QzJgx9Aul3NBTTF6DlQyEjPpZAI",
  //         "x5t#S256": "OzjKgXWS23Gg6rjYEw6Lg70L9ZnzsMv-vyK95df8OLo",
  //         "x5c": [
  //           "MIIBszCCATmgAwIBAgIBATAKBggqhkjOPQQDAzASMRAwDgYDVQQDEwdUZXN0IENBMB4XDTIwMDEwMTA2MDAwMFoXDTIwMDEwMzA2MDAwMFowEjEQMA4GA1UEAxMHVGVzdCBDQTB2MBAGByqGSM49AgEGBSuBBAAiA2IABE8ti3nRQKdY6hBXmGSxevaMV9ewgDQXeUngy8QHIgZBCaPUa3hEH8tc0y63R1zOOVN8uBm/2D4IIBv9vXs0hwSw4+21QqkWe9nbjwNRY1Lxq7DJdSuS5iCvabOBrrZuZKNjMGEwQAYDVR0RBDkwN6AfBgkrBgEEAYI3GQGgEgQQrk8d+Ox90BGnZQCgyR5r9oYUZGlkOndlYjpyb290LmV4YW1wbGUwHQYDVR0OBBYEFK59YgT442T7B2q2tKLZRA2zS7U0MAoGCCqGSM49BAMDA2gAMGUCMQCwtJKXlglLeHoyW5gcqaJiWrXlnGBZIZt8eVG5mgOFtf+gQiyEpaV/NSZzZoJTprACMBTTTMZuEAc6KiOBYcKbfNJoYckp774AhUuWlartVA8oeW88HcVq/mGo4Hb/4C1P3Q=="
  //         ]
  //       }
  //     ]
  //   },
  //   "payload": {
  //     "urn:example:claim": true,
  //     "iat": 1689525269,
  //     "iss": "urn:example:issuer",
  //     "exp": 1689532469
  //   },
  //   "protectedHeader": {
  //     "alg": "ES384",
  //     "kid": "urn:ietf:params:oauth:jwk-thumbprint:sha-256:XiwJN7HGPnxsE7oZCp0TDHvTXhb9hlS3JESM_OgshCU",
  //     "x5u": "https://vendor.example/certs"
  //   }
  // }
  

})()