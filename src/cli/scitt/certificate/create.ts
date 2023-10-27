import fs from "fs"
import path from "path"

import crypto from 'crypto'
import x509 from '@peculiar/x509'
import * as jose from 'jose'

import cose from '@transmute/cose'

// https://github.com/PeculiarVentures/x509
// eslint-disable-next-line @typescript-eslint/no-explicit-any
x509.cryptoProvider.set(crypto as any);
const extractable = true
/* 

npm run transmute -- scitt certificate create \
--alg ES256 \
--valid-from 2020/01/01 \
--valid-until 2020/01/03 \
--issuer CN=Test CA \
--subject CN=Test CA \
--subject-guid f81d4fae-7dec-11d0-a765-00a0c91e6bf6 \
--subject-did did:web:root.transparency.example \
--subject-private-key examples/scitt/cert.private.jwk.json \
--subject-certificate examples/scitt/cert.public.pem


npm run transmute -- scitt certificate create \
--alg ES256 \
--valid-from 2020/01/01 \
--valid-until 2020/01/03 \
--issuer-private-key examples/scitt/cert.private.jwk.json \
--issuer-certificate examples/scitt/cert.public.pem \
--subject CN=Test CA \
--subject-did did:web:issuer.key.transparency.example \
--subject-private-key examples/scitt/user.private.jwk.json \
--subject-public-key examples/scitt/user.public.jwk.json \
--subject-certificate examples/scitt/user.cert.pem
*/

interface RequestCertificate {
  alg: string
  validFrom: string
  validUntil: string
  issuer: string
  issuerPrivateKey: string
  issuerCertificate: string
  subject: string
  subjectGuid: string
  subjectDid: string
  subjectPublicKey: string
  subjectPrivateKey: string
  subjectCertificate: string
}

const algTowebCryptoParams = {
  'ES256': {
    name: "ECDSA",
    hash: "SHA-256",
    namedCurve: "P-256",
  },
  'ES384': {
    name: "ECDSA",
    hash: "SHA-384",
    namedCurve: "P-384",
  }
}


const createRootCertificate = async (argv: RequestCertificate) => {
  const alg = algTowebCryptoParams[argv.alg]
  const caKeys = await crypto.subtle.generateKey(alg, extractable, ["sign", "verify"]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extensions: any = []
  if (argv.subjectGuid) {
    extensions.push({
      type: 'guid', value: argv.subjectGuid
    })
  }
  if (argv.subjectDid) {
    extensions.push({
      type: 'url', value: argv.subjectDid
    })
  }
  const caCert = await x509.X509CertificateGenerator.create({
    serialNumber: "01",
    subject: argv.subject,
    issuer: argv.subject,
    notBefore: new Date(argv.validFrom),
    notAfter: new Date(argv.validUntil),
    signingAlgorithm: alg,
    publicKey: caKeys.publicKey,   // self signed
    signingKey: caKeys.privateKey, // self signed
    extensions: [
      new x509.SubjectAlternativeNameExtension(extensions),
      await x509.SubjectKeyIdentifierExtension.create(caKeys.publicKey)
    ]
  });
  const certPem = caCert.toString()
  const privateKeyJwk = await jose.exportJWK(caKeys.privateKey)
  privateKeyJwk.alg = argv.alg;
  privateKeyJwk.kid = await jose.calculateJwkThumbprintUri(privateKeyJwk)
  const publicKeyJwk = await jose.exportJWK(caKeys.publicKey)
  publicKeyJwk.alg = argv.alg;
  publicKeyJwk.kid = await jose.calculateJwkThumbprintUri(publicKeyJwk)

  return {
    subjectCertificate: certPem,
    subjectPublicKey: JSON.stringify(publicKeyJwk, null, 2),
    subjectPrivateKey: JSON.stringify(privateKeyJwk, null, 2),
  }

}



const createLeafCertificate = async (argv: RequestCertificate) => {
  const issuerCert = fs.readFileSync(path.resolve(process.cwd(), argv.issuerCertificate))
  const caCert = new x509.X509Certificate(issuerCert.toString())
  const alg = algTowebCryptoParams[argv.alg]
  const userKeys = await crypto.subtle.generateKey(alg, extractable, ["sign", "verify"]);

  const issuerPrivateKeyCose = fs.readFileSync(path.resolve(process.cwd(), argv.issuerPrivateKey))
  const issuerPrivateKey = cose.key.exportJWK(cose.cbor.decode(issuerPrivateKeyCose))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extensions: any = []
  if (argv.subjectGuid) {
    extensions.push({
      type: 'guid', value: argv.subjectGuid
    })
  }
  if (argv.subjectDid) {
    extensions.push({
      type: 'url', value: argv.subjectDid
    })
  }
  const userCert = await x509.X509CertificateGenerator.create({
    serialNumber: "01",
    subject: argv.subject,
    issuer: caCert.issuer,
    notBefore: new Date(argv.validFrom),
    notAfter: new Date(argv.validUntil),
    signingAlgorithm: alg,
    publicKey: userKeys.publicKey, // leaf public key
    signingKey: await crypto.subtle.importKey(
      "jwk",
      issuerPrivateKey,
      alg,
      true,
      ["sign"],
    ), // root private key
    extensions: [
      new x509.SubjectAlternativeNameExtension(extensions),
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
  const x5c = items.map((cert) => {
    return cert.toString('base64')
  })
  // export use keys as jwks with cert chain
  const ecPublicKey = await jose.importX509(userCert.toString(), argv.alg)
  const userPublicKeyJwk = await jose.exportJWK(ecPublicKey)
  userPublicKeyJwk.kid = await jose.calculateJwkThumbprintUri(userPublicKeyJwk)
  userPublicKeyJwk.alg = argv.alg
  userPublicKeyJwk.x5c = x5c
  const userPrivateKeyJwk = {
    ...userPublicKeyJwk,
    ...await jose.exportJWK(userKeys.privateKey)
  }
  delete userPrivateKeyJwk.x5c
  const certPem = userCert.toString()
  return {
    subjectCertificate: certPem,
    subjectPublicKey: JSON.stringify(userPublicKeyJwk, null, 2),
    subjectPrivateKey: JSON.stringify(userPrivateKeyJwk, null, 2),
  }
}


const create = async (argv: RequestCertificate) => {
  let cert;
  if (!argv.issuerCertificate) {
    // root cert
    cert = await createRootCertificate(argv)
    const subjectPrivateKey = cose.cbor.encode(cose.key.importJWK(JSON.parse(cert.subjectPrivateKey)))
    fs.writeFileSync(
      path.resolve(process.cwd(), argv.subjectPrivateKey),
      Buffer.from(subjectPrivateKey)
    )
    fs.writeFileSync(
      path.resolve(process.cwd(), argv.subjectCertificate),
      Buffer.from(cert.subjectCertificate)
    )

  } else {
    // leaf cert
    cert = await createLeafCertificate(argv)

    const subjectPublicCoseKeyMap = cose.key.importJWK(JSON.parse(cert.subjectPublicKey))
    const subjectPublicKey = cose.cbor.encode(subjectPublicCoseKeyMap)
    const subjectPrivateCoseKeyMap = cose.key.importJWK(JSON.parse(cert.subjectPrivateKey))
    subjectPrivateCoseKeyMap.set(-66666, subjectPublicCoseKeyMap.get(-66666) as any)
    const subjectPrivateKey = cose.cbor.encode(subjectPrivateCoseKeyMap)

    fs.writeFileSync(
      path.resolve(process.cwd(), argv.subjectPublicKey),
      Buffer.from(subjectPublicKey)
    )
    fs.writeFileSync(
      path.resolve(process.cwd(), argv.subjectPrivateKey),
      Buffer.from(subjectPrivateKey)
    )
    fs.writeFileSync(
      path.resolve(process.cwd(), argv.subjectCertificate),
      Buffer.from(cert.subjectCertificate)
    )
  }
}

export default create