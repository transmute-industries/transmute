const fs = require("fs");
const path = require("path");
const transmuteDID = require("@transmute/transmute-did");

(async () => {
  // console.log("encrypting...");
  const password = process.argv[process.argv.length - 1];
  const wallet = new transmuteDID.wallet.TransmuteDIDWallet(
    JSON.parse(
      fs
        .readFileSync(path.resolve(__dirname, "../wallet/ciphertext.json"))
        .toString()
    )
  );

  await wallet.decrypt(password);

  fs.writeFileSync(
    path.resolve(__dirname, "../wallet/plaintext.json"),
    JSON.stringify(wallet.data, null, 2)
  );

  console.log("👛  created ./wallet/plaintext.json");
})();
