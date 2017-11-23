const functions = require("firebase-functions");
const querystring = require("querystring");
const url = require("url");
const cors = require("cors")({ origin: true });
const user_functions = require("./src");
const _ = require("lodash");

// wire up all user functions... 
_.forEach(_.keys(user_functions), name => {
  exports[name] = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      return user_functions
        [name]({
          name: name,
          query: querystring.parse(url.parse(req.url).query),
          body: req.body
        })
        .then(response => {
          if (!response.redirect) {
            res.status(response.status).json(response);
          } else {
            res.redirect(response.redirect);
          }
        });
    });
  });
});
