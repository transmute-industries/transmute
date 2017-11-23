const path = require("path");

module.exports = vorpal => {

    vorpal
    .command("sign", "sign a message with the default address")
    .option("-m, --message <msg>", "the message text")
    .action(async (args, callback) => {
      const accounts = await vorpal.T.getAccounts();
      const address = accounts[0];
      const { messageBufferHex, signature } = await T.Toolbox.sign(
        address,
        args.options.message
      );
      console.log("💌  " + messageBufferHex);
      console.log("🔏  " + signature);
      callback();
    });
  
  vorpal
    .command(
      "recover",
      "recover the address used to sign a message from a signature"
    )
    .option("-m, --message <msg>", "the message hex")
    .option("-s, --signature <sig>", "the message signature")
    .types({
      string: ["m", "message", "s", "signature"]
    })
    .action(async (args, callback) => {
      const accounts = await vorpal.T.getAccounts();
      const address = accounts[0];
      const recoveredAddress = await vorpal.T.Toolbox.recover(
        args.options.message,
        args.options.signature
      );
      console.log("🔏  " + recoveredAddress);
      callback();
    });

  return vorpal;
};
