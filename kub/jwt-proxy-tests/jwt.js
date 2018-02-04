const jose = require("node-jose");

(async () => {
  let keystore = jose.JWK.createKeyStore();

  let firstkey = {
    kty: "EC",
    kid: "inzHcootItr68X9cWzzC-zd41tQVzjcOFI4qrBXtyYQ",
    crv: "P-256",
    x: "Mq49tp3LfHTIdlhg-peJLGNiULGWcTbPMj5czZoWtwM",
    y: "l2W3Oo-29-aa-853C5vf0TZd5jUEe5sungzKp3mf6mA"
  };

  let secondKey = await keystore.generate("EC", "P-256");
  await keystore.add(firstkey, "json");

  let data = new Buffer(JSON.stringify({ customer: true }));

  let signedData = await jose.JWS.createSign(secondKey)
    .update(data)
    .final();

  console.log('signedData: ', signedData);

  let recoverdData = await jose.JWS.createVerify(keystore).verify(signedData);

  console.log('\nrecoverdData: ', recoverdData);
  //   let keystoreJson = keystore.toJSON(true);
  //   console.log(keystoreJson);


  let output = jose.util.base64url.encode(input, "utf8");


})();
