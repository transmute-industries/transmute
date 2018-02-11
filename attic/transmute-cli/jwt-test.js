const { JWE, JWK, JWS } = require("node-jose");
const fs = require("fs");
const { join } = require("path");
const jwkToPem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");

const certDir = ".cert";
const keystoreFile = join(certDir, "keystore.json");
const raw = {
  iss: "test",
  exp: new Date().getTime() + 3600,
  sub: {
    test: "This is a test"
  }
};

// https://jwt.io/
// https://connect2id.com/products/nimbus-jose-jwt/examples/signed-and-encrypted-jwt

async function start() {
  var keystore = JWK.createKeyStore();

  if (!fs.existsSync(keystoreFile)) {
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir);
    }
    console.log("generate keystore");
    await keystore.generate("EC", "P-256", { alg: "ES256", use: "sig" });
    await keystore.generate("oct", 256, { use: "enc" });

    fs.writeFileSync(
      keystoreFile,
      JSON.stringify(keystore.toJSON(true), null, 2)
    );
  } else {
    console.log("import keystore");
    const ks = fs.readFileSync(join(".cert", "keystore.json"));
    keystore = await JWK.asKeyStore(ks.toString());
  }

  // Use first sig sigKey
  const sigKey = keystore.all({ use: "sig" })[0];
  const encKey = keystore.all({ use: "enc" })[0];

 
  // Sign payload
  const payload = JSON.stringify(raw);
  const opt = { compact: true, jwk: sigKey, fields: { typ: "jwt" } };
  const token = await JWS.createSign(opt, sigKey)
    .update(payload)
    .final();

  // Make JWT
  console.log("JWT");
  console.log(token);

  // Encrypt JWT
  let encryptedToken = await JWE.createEncrypt(encKey)
  .update(token)
  .final();

  // Decrypt JWT

  let decryptedToken = await JWE.createDecrypt(encKey)
  .decrypt(encryptedToken)

  let plaintextToken = decryptedToken.plaintext.toString()

  // Verify Token
  const v = await JWS.createVerify(keystore).verify(plaintextToken);
  console.log("Verify Token");
  console.log(v.header);
  console.log(v.payload.toString());

  // Verify Token with jsonwebtoken
  const publicKey = jwkToPem(sigKey.toJSON());
  const privateKey = jwkToPem(sigKey.toJSON(true), { private: true });

  console.log("public", publicKey);
  console.log("private", privateKey);

  const decoded = jwt.verify(token, publicKey);
  console.log(decoded);
  process.exit();
}

start();
