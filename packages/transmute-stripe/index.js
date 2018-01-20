require("dotenv").config({ path: "./secret.env" });

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getAllPlans = async () => {
  const plans = await stripe.plans.list();
  return plans.data;
};

const deletePlan = async id => {
  let data = await stripe.plans.del(id);
  return data.deleted;
};

const createPlan = async () => {
  const plan = await stripe.plans.create({
    currency: "usd",
    interval: "month",
    name: "Pro Plan",
    amount: 3000,
    id: "pro-monthly"
  });
  return plan;
};

const createCustomer = async email => {
  // const ownerInfo = {
  //     owner: {
  //       name: 'Jenny Rosen',
  //       address: {
  //         line1: 'Nollendorfstraße 27',
  //         city: 'Berlin',
  //         postal_code: '10777',
  //         country: 'DE',
  //       },
  //       email: 'jenny.rosen@example.com'
  //     },
  //   };

  const customer = await stripe.customers.create({
    email
  });
  return customer;
};

const getAllCustomers = async () => {
  const customers = await stripe.customers.list();
  return customers.data;
};

const deleteCustomer = async id => {
  const res = await stripe.customers.del(id);
  return res.deleted;
};

const subscribeCustomerToPlan = async (customerId, planId) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ plan: planId }]
  });
  return subscription;
};

const getAllSubscriptions = async planId => {
  const subscriptions = stripe.subscriptions.list({
    plan: planId
  });
  return subscriptions.data;
};

// const planTests = async () => {
//     let plan = await createPlan();
//     console.log("created plan: ", plan, "\n");
//     const plans = await getAllPlans();
//     console.log("got plans: ", plans, "\n");
//     const deleted = await deletePlan(plans[0].id);
//     console.log("deleted plan: ", deleted, "\n");
// };

// const customerTests = async () => {
//   const customer = await createCustomer("jenny.rosen@example.com");
//   console.log('created customer: ', customer);
//   let customers = await getAllCustomers();
//   console.log('got all customers: ', customers);
//   let deleted = await deleteCustomer(customers[0].id);
//   console.log('deleted customer: ', deleted)
// };

const cleanup = async () => {
  const customers = await getAllCustomers();
  for (let i = 0; i < customers.length; i++) {
    await deleteCustomer(customers[0].id);
  }

  const plans = await getAllPlans();
  for (let i = 0; i < plans.length; i++) {
    await deletePlan(plans[0].id);
  }
  console.log("all clean.");
};

const lifecycleTest = async () => {
  console.log("create subscribe and delete...\n");

  // create plan
  let plans = await getAllPlans();
  if (!plans.length) {
    await createPlan();
    plans = await getAllPlans();
  }

  // create customer
  let customers = await getAllCustomers();
  if (!customers.length) {
    await createCustomer();
    customers = await getAllCustomers();
  }

  // subscribe customer to plan
  // await subscribeCustomerToPlan(customers[0].id, plans[0].id);

  // list all customers subscribed to plan
  //   const subscriptions = await getAllSubscriptions(plans[0].id)
  //   console.log(subscriptions)
};

(async () => {
  console.log("stripe tests....\n");

  //   await lifecycleTest();

//   await cleanup();

  process.exit(0);
})();
