const { writeFile } = require("../utils");

const getReadModel = require("./getReadModel");

module.exports = vorpal => {
  vorpal
    .command(
      "buildTrustedModel",
      "Build a ReadModel of a Smart Contract with EventStore Adapters"
    )
    .action(async (args, callback) => {
      const { init } = require("../transmute/index");
      const {
        T,
        relic,
        eventStoreAdapter,
        readModelAdapter,
        accounts
      } = await init();
      const deployFromDefault = T.W3.TC.txParamsDefaultDeploy(accounts[0]);

      const eventStoreReadModel = require("../../EventStore.ReadModel.json");
      const eventStore = await T.Store.get(
        eventStoreReadModel.contractAddress,
        relic.web3
      );
      const readModel = getReadModel(
        T,
        eventStoreReadModel.contractAddress,
        readModelAdapter
      );

      let updated = await readModel.sync(
        eventStore,
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
