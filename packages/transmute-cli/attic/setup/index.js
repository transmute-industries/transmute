const path = require("path");
const os = require("os");
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));

const shell = require("shelljs");

const USE_YARN = "/Users/orie/Code/transmute-cli" === process.cwd();

const COMMAND_BASE = USE_YARN ? "yarn transmute" : "transmute";

module.exports = vorpal => {
  const getOrCreateRCDir = async () => {
    let cmd = "mkdir ~/.transmute";
    vorpal.logger.log(cmd);
    if (shell.exec(cmd).code !== 0) {
      vorpal.logger.fatal("Error: failed command: " + cmd);
      shell.exit(1);
    }

    // Copy move .transmute-template to ~/.transmute
    let template_dir = path.join(__dirname, "../../.transmute-template/*");
    cmd = `cp -r ${template_dir} ~/.transmute/`;
    vorpal.logger.log(cmd);
    if (shell.exec(cmd).code !== 0) {
      vorpal.logger.fatal("Error: failed command: " + cmd);
      shell.exit(1);
    }

    // Rename example env to secret env.
    cmd = `mv ~/.transmute/environment.example.env ~/.transmute/environment.secret.env`;
    vorpal.logger.log(cmd);
    if (shell.exec(cmd).code !== 0) {
      vorpal.logger.fatal("Error: failed command: " + cmd);
      shell.exit(1);
    }
  };

  const destroyRCDir = async () => {
    try {
      const rc_path = path.join(os.homedir(), ".transmute");
      let cmd = "rm -rf " + rc_path;
      vorpal.logger.warn(cmd);
      if (shell.exec(cmd).code !== 0) {
        vorpal.logger.fatal("Error: failed command: " + cmd);
        shell.exit(1);
      }
      vorpal.logger.info("TransmuteCLI has been reset.");
    } catch (e) {
      vorpal.logger.warn("No .transmute directory... ");
    }
  };

  vorpal
    .command("setup", "build.....")
    .option("-f, --from <secretPath>", "a .transmute directory to reset from.")
    .action(async (args, callback) => {
      await destroyRCDir();

      let fromSecretPath = args.options.from;

      await getOrCreateRCDir();

      let cmd, secretEnvPath;
      //OVERWRITE WITH REAL SECRETS
      if (fromSecretPath) {
        try {
          secretEnvPath = path.join(os.homedir(), ".transmute");
          cmd = `cp -R ${fromSecretPath}/* ${secretEnvPath}`;
          if (shell.exec(cmd).code !== 0) {
            vorpal.logger.fatal("Error: failed command: " + cmd);
            shell.exit(1);
          }
          vorpal.logger.info("Setup secrets have been overwritten!");
        } catch (e) {
          vorpal.logger.warn("Be sure to update: secretEnvPath");
        }

        vorpal.logger.info(`cat ${secretEnvPath}`);
      } else {
        let prefix = "dapp";

        let secretEnvPathAbs = path.join(
          os.homedir(),
          ".transmute",
          "environment.secret.env"
        );

        let firebaseJsonConfigAbsPath = path.join(
          os.homedir(),
          ".transmute",
          "firebase-client-config.json"
        );

        let environmentWebAbsPath = path.join(
          os.homedir(),
          ".transmute",
          "environment.web"
        );

        let environmentNodeAbsPath = path.join(
          os.homedir(),
          ".transmute",
          "environment.node"
        );

        let langs = ["js"];

        await Promise.all(
          langs.map(async lang => {
            await require(`../env/generate/${lang}-web`)(
              {
                firebaseConfigPath: firebaseJsonConfigAbsPath,
                outputEnvPath: `${environmentWebAbsPath}.${lang}`
              },
              () => {
                vorpal.logger.log(
                  `transmute gen-web ${lang} ${environmentWebAbsPath}.${lang}`
                );
              }
            );

            return await require(`../env/generate/${lang}-node`)(
              {
                prefix: prefix,
                secretEnvPath: secretEnvPathAbs,
                outputEnvPath: `${environmentNodeAbsPath}.${lang}`
              },
              () => {
                vorpal.logger.log(
                  `transmute gen-node ${lang} ${prefix} ${secretEnvPathAbs} ${environmentNodeAbsPath}.${lang}`
                );
              }
            );
          })
        );
      }

      callback();
    });

  return vorpal;
};
