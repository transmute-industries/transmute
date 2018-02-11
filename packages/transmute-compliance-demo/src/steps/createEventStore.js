const { writeFile } = require("../utils");

const getReadModel = require("./getReadModel");

module.exports = vorpal => {
  vorpal
    .command("createEventStore", "Create an EvenStore Smart Contract.")
    .action(async (args, callback) => {
      const { init } = require("../transmute/index");
      const { T, eventStoreAdapter, readModelAdapter, accounts } = await init();
      const deployFromDefault = T.W3.TC.txParamsDefaultDeploy(accounts[0]);
      const newEventStore = await T.EventStore.New(deployFromDefault);
      const receipt = await newEventStore.setWhitelist(
        accounts,
        deployFromDefault
      );
      let events = T.EventTransformer.getFSAsFromReceipt(receipt);

      const readModel = getReadModel(
        T,
        newEventStore.address,
        readModelAdapter
      );

      let updated = await readModel.sync(
        newEventStore,
        eventStoreAdapter,
        T.Relic.web3
      );

      await writeFile(
        "./EventStore.ReadModel.json",
        JSON.stringify(readModel.state, null, 2)
      );

      vorpal.logger.info(JSON.stringify(readModel.state, null, 2));

      callback();
    });

  return vorpal;
};
