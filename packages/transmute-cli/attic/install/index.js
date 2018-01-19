module.exports = vorpal => {
  vorpal
    .command("install globals", "install all global node dependencies")
    .action((args, callback) => {
      require("./globals")(callback);
    });

  return vorpal;
};
