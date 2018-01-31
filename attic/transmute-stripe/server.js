require("dotenv").config({ path: "./secret.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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

app.get("/plans", async (req, res) => {
  const plans = await stripe.plans.list();
  res.json(plans);
});

app.get("/customers", async (req, res) => {
  const customers = await stripe.customers.list();
  res.json(customers);
});

app.get("/subscriptions", async (req, res) => {
  const subscriptions = await stripe.subscriptions.list();
  res.json(subscriptions);
});

app.post("/subscribe", async (req, res) => {
  let { stripeToken, stripeTokenType, stripeEmail } = req.body;
  // {
  // stripeToken: ".....",
  // stripeTokenType: "card",
  // stripeEmail: "..."
  // }
  const plans = await stripe.plans.list();
  if (plans.data.length) {
    const customer = await stripe.customers.create({
      email: stripeEmail,
      source: stripeToken,
      plan: plans.data[0].id
    });
    res.json({
      message: "created customer."
    });
  } else {
    res.status(500);
    res.json({
      message: "no plans exist."
    });
  }
});

app.listen(3001, async () => {
  console.log("Example app listening on port 3001!");
});
