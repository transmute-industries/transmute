const express = require("express");

const app = express();
require("express-async-await")(app);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static("public"));

app.post("/stripe-token", async (req, res) => {
  // {
  // stripeToken: ".....",
  // stripeTokenType: "card",
  // stripeEmail: "bob@example.com"
  // }
  let { stripeToken, stripeTokenType, stripeEmail } = req.body;
  console.log(req.body);
  res.json(req.body);
});

app.listen(3001, async () => {
  console.log("Example app listening on port 3001!");
});
