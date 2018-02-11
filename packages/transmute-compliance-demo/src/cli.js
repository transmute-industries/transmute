const vorpal = require("vorpal")();
const vorpalLog = require("vorpal-log");
const vorpalTour = require("vorpal-tour");

vorpal.use(vorpalLog);

require("./steps/createEventStore")(vorpal);
require("./steps/logEvents")(vorpal);
require("./steps/buildTrustedModel")(vorpal);

vorpal.use(vorpalTour, {
  command: "tour",
  tour: function(tour) {
    // Colors the "tour guide" text.
    tour.color("cyan");

    tour
      .step(1)
      .begin('Create an EventStore Smart Contract. Run "createEventStore".')
      .expect("command", (data, cb) => {
        cb(data.command.indexOf("createEventStore") !== -1);
      })
      .reject('Uh.. Let\'s type "createEventStore PASSWORD" instead...')
      .wait(500)
      .end("Updates saved to ./EventStore.ReadModel.json");

    tour
      .step(2)
      .begin('Store signed events. Run "logEvents".')
      .expect("command", (data, cb) => {
        cb(data.command.indexOf("logEvents") !== -1);
      })
      .reject('Uh.. Let\'s type "logEvents" instead...')
      .wait(500)
      .end("Events saved to ./Events.json");

    tour
      .step(3)
      .begin(
        'Build an event sourced data model from signed events. Run "buildTrustedModel".'
      )
      .expect("command", (data, cb) => {
        cb(data.command.indexOf("buildTrustedModel") !== -1);
      })
      .reject('Uh.. Let\'s type "buildTrustedModel" instead...')
      .wait(500)
      .end("Updates saved to ./EventStore.ReadModel.json");

    // A delay in millis between steps.
    tour.wait(1000);

    tour.end(
      "This concludes the tutorial! If you found this helpful please completes this survey: "
    );

    return tour;
  }
});

const welcome = `

 💎  WORK IN PROGRESS

 🤖  Welcome to the Transmute Framework Compliance demo!

 🔥  Do not use this in production. 🔥

To get started, type: 

tour

And press enter.
`;

console.log(welcome);
vorpal
  .parse(process.argv)
  .delimiter("🦄   $")
  .show();
