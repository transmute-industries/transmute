const jose = require("node-jose");

const { writeFile, readFile } = require("./utils");

module.exports = vorpal => {
  vorpal
    .command("jose", "check connections...")
    .action(async (args, callback) => {
      let storeData = await readFile("./plainTextKeyStore.json");
      let keystore = await jose.JWK.asKeyStore(JSON.parse(storeData));
      let key = keystore.get("mHKh3BHV2usadKq4PDSO_6O42_ftWhzxiVcrOhw6vbQ", {
        kty: "EC"
      });

    //   console.log(key)

      const claims = JSON.stringify({
        iss: "http://www.example.com",
        exp: Math.round(new Date().getTime() / 1000), // expires immediatly
        sub: 42
      });

    //   console.log("claims...", claims);

      let encryptedClaims = await jose.JWE.createEncrypt(key)
        .update(claims)
        .final();

      console.log(encryptedClaims);

    //   let signedEncryptedClaims = await jose.JWS.createSign(key)
    //     .update(encryptedClaims.ciphertext)
    //     .final();

    //   console.log(signedEncryptedClaims);

      callback();
    });
};


// https://javascriptexamples.info/code/node%20jose/

// let myJWT = await createJWT(key, {
//     customer: true,
//     address: "0x0deadbeef"
//   });

// start here... wrap jose tools for keystore CRUD / SIGN / VERIFY / ENCRYPT / DECRYPT
//   let keystore = jose.JWK.createKeyStore();
//   let secondKey = await keystore.generate("EC", "P-256");
// await keystore.add(secondKey, "json");

//    //   let signedData = await jose.JWS.createSign(key)
//       //     .update(data)
//       //     .final();

//       //   console.log(signedData);

//       //   let recoverdData = await jose.JWS.createVerify(keystore).verify(signedData);

//       //   console.log("\nrecoverdData: ", recoverdData);

//       //   let output = jose.util.base64url.encode(input, "utf8");

//       //   let keystoreJson = keystore.toJSON(true);
//       //   console.log("keystoreJson!!! ", keystoreJson);
//       //   await writeFile(
//       //     "./plainTextKeyStore.json",
//       //     JSON.stringify(keystoreJson, null, 2)
//       //   );

// // BASE64URLENCODE(<header>) + "." + BASE64URLENCODE(<payload>) + "." + BASE64URLENCODE(<signature>)

// const createJWT = async (key, payload) => {

//     let data = new Buffer(JSON.stringify(payload));

//     let signedData = await jose.JWS.createSign(key)
//       .update(data)
//       .final();

//     // jose.util.base64url.encode(input, "utf8");

//     let header = JSON.stringify(signedData)

//     console.log(header)

//   //   const encodedHeader = jose.util.base64url.encode(
//   //     ,
//   //     "utf8"
//   //   );

//   //   console.log(encodedHeader);
//   };
