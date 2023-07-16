

### Other Resources

- https://github.com/transmute-industries/openssl-did-web-tutorial

  // const certPem = cert.toString("pem")
  // const privateKeyJwk = await crypto.subtle.exportKey("jwk", keys.privateKey);
  // const publicKeyJwk = await crypto.subtle.exportKey("jwk", keys.publicKey);

// const createCert = async (leafPublicKey, rootPrivateKey)=> {
//   const publicKey = await crypto.subtle.importKey(
//     "jwk",
//     leafPublicKey,
//     alg,
//     true,
//     ["verify"]
//   );
//   const cert = await x509.X509CertificateGenerator.create({
//     publicKey: publicKey,
//     signature: Buffer.from(''),
//     ...{
//       serialNumber: "01",
//       name: "CN=Test, O=Дом",
//       subject: "CN=Test, O=Дом",
//       issuer: "CN=Test, O=Дом",
//       notBefore: new Date(Date.UTC(2020, 0, 1, 8, 0, 0)), // UTCTime 2020-01-01 08:00:00 UTC
//       notAfter: new Date(Date.UTC(2040, 0, 2, 8, 0, 0)),  // UTCTime 2040-01-02 08:00:00 UTC
//       signingAlgorithm: alg,
//       extensions: [
//         new x509.BasicConstraintsExtension(true, 2, true),
//         new x509.ExtendedKeyUsageExtension(["1.2.3.4.5.6.7", "2.3.4.5.6.7.8"], true),
//         new x509.KeyUsagesExtension(x509.KeyUsageFlags.keyCertSign | x509.KeyUsageFlags.cRLSign, true),
//         new x509.CertificatePolicyExtension([
//           "1.2.3.4.5",
//           "1.2.3.4.5.6",
//           "1.2.3.4.5.6.7",
//         ]),
//       ]
//     }
//   });
//   const ok = await cert.verify({ date: new Date(Date.UTC(2040, 0, 1, 8, 0, 1)) });
//   console.log(ok)
//   // const certPem = cert.toString("pem")
//   // const privateKeyJwk = await crypto.subtle.exportKey("jwk", keys.privateKey);
//   // const publicKeyJwk = await crypto.subtle.exportKey("jwk", keys.publicKey);
//   // return {
//   //   cert,
//   //   pem: certPem,
//   //   publicKey: publicKeyJwk,
//   //   privateKey: privateKeyJwk 
//   // }
// }

// const leafKeys = await crypto.subtle.generateKey(alg, true, ["sign", "verify"]);
  // const leafPublicKeyJwk = await crypto.subtle.exportKey("jwk", leafKeys.publicKey); 
  // const leaf = await createCert(leafPublicKeyJwk, root.privateKey);

  // const chain = new x509.X509ChainBuilder({
  //   certificates: [
  //     root.cert,
  //     leaf.cert,
  //   ],
  // });

  // console.log(chain)


  // fs.writeFileSync(
  //   path.resolve(process.cwd(), 'examples/x509/cert.pem'),
  //   Buffer.from(root.pem)
  // )
  // fs.writeFileSync(
  //   path.resolve(process.cwd(), 'examples/x509/cert.private.jwk.json'),
  //   Buffer.from(JSON.stringify(root.privateKey, null, 2))
  // )
  // fs.writeFileSync(
  //   path.resolve(process.cwd(), 'examples/x509/cert.public.jwk.json'),
  //   Buffer.from(JSON.stringify(root.publicKey, null, 2))
  // )