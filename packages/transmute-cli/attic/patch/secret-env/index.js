const path = require("path");

// yarn transmute patch-secret-env ../smoke/dapp/functions/.transmute/environment.secret.env  --reset ../smoke/dapp/functions/.transmute/

const replace = require("replace-in-file");

// THIS IS BROKEN...
module.exports = vorpal => {
  vorpal
    .command(
      "patch-secret-env [pathToSecretEnv]",
      "an api for editing environment.secret.env"
    )
    .option(
      "-r, --reset <secretPath>",
      "a .transmute directory to reset paths to."
    )
    .action((args, callback) => {
      vorpal.logger.log("patching secret env...");
      const absPathToSecretEnv = args.pathToSecretEnv;

      //   console.log(absPathToSecretEnv);
      //   console.log(args.options.reset);

      if (args.options.reset) {
        const absPathToResetTransmuteFolder = args.options.reset;

        return replace({
          files: [absPathToSecretEnv],
          from: /"\/Users\/.*\/.transmute\//g,
          to: match => {
            console.log('m: ', match)
            return absPathToResetTransmuteFolder;
            //   return match;
          }
        })
          .then(changes => {
            console.log("Modified files:", changes.join(", "));
            vorpal.logger.info("Patched Paths In: " + absPathToSecretEnv);
          })
          .catch(error => {
            console.error("Error occurred:", error);
          })
          .finally(() => {
            callback();
          });
      } else {
        callback();
      }
    });

  return vorpal;
};
