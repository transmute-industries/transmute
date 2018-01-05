const path = require("path");

module.exports = vorpal => {
  vorpal
    .command("status", "report on the status of the cli.")
    .action((args, callback) => {
      var unsubscribe = vorpal.T.firebaseApp
        .auth()
        .onAuthStateChanged(function(user) {
          // handle it
          if (user) {
            console.log("🔵  Logged in as:", user.uid);
            unsubscribe();
            callback();
          } else {
            console.log("🔴  Logged out.");
            unsubscribe();
            callback();
          }
        });
    });

  vorpal
    .command("login", "login to firebase with transmute-framework")
    .action(async (args, callback) => {
      let user = await vorpal.T.Firebase.login();
      vorpal.logger.info("Logged in as: " + user.uid);
      callback();
    });

  vorpal
    .command("logout", "logout to firebase with transmute-framework")
    .action(async (args, callback) => {
      let user = await vorpal.T.Firebase.logout();
      vorpal.logger.info("Logged logged out.");
      callback();
    });

  vorpal
    .command("token_challenges", "list all token_challenges (requires login)")
    .action(async (args, callback) => {
      // see https://github.com/firebase/firebase-js-sdk/issues/198
      // currently only admin sdk can access firestore...
      // in the future, the cli will be able login and then use firestore...
      // this will be handy for data exporting, migrating, rebuilding etc...


      await vorpal.T.db
        .collection("token_challenges")
        .get()
        .then(querySnapshot => {
          // console.log(querySnapshot);
          querySnapshot.forEach(doc => {
            // console.log(`${doc.id} => `, doc.data());
            vorpal.logger.info(doc.id);
          });
        })
        .catch(err => {
          console.log(err);
        });

      callback();
    });
};
