const path = require("path");

module.exports = vorpal => {
  
  vorpal
    .command("gen-mask [dotenv] [output]", "build.....")
    .action((args, callback) => {
      require("./generate/mask")(args, callback);
    });

  vorpal
    .command(
      "gen-web [lang] [outputEnvPath]",
      "build....."
    )
    .action((args, callback) => {
      switch (args.lang) {
        case "js":
          return require("./generate/js-web")(args, callback);
        // case "ts":
        //   return require("./generate/ts-web")(args, callback);
      }
    });

  vorpal
    .command(
      "gen-node [lang] [prefix] [secretEnvPath] [outputEnvPath]",
      "build....."
    )
    .action((args, callback) => {
      // console.log(args)
      switch (args.lang) {
        case "js":
          return require("./generate/js-node")(args, callback);
        // case "ts":
        //   return require("./generate/ts-node")(args, callback);
      }
    });

    vorpal
    .command(
      "mig-env [type] [prefix] [dotenv]",
      "converts .env to firebase functions:config:set command and executes it. See https://firebase.google.com/docs/functions/config-env"
    )
    .action((args, callback) => {
      switch (args.type) {
        case "firebase":
          require('./migrate/firebase')(args, callback);
          break;
      }
    });

  return vorpal;
};
