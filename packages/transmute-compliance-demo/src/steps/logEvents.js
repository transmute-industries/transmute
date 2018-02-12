const { writeFile } = require("../utils");

module.exports = vorpal => {
  vorpal
    .command("logEvents", "log some sample events")
    .action(async (args, callback) => {
      vorpal.logger.info("Writing events to a smart contract: \n");
      console.log(`
      const eventStoreReadModel = require("../../EventStore.ReadModel.json");
      const eventStore = await T.Store.get(
        eventStoreReadModel.contractAddress,
        relic.web3
      );
      let events = await T.Store.writeFSAs(
        eventStore,
        eventStoreAdapter,
        relic.web3,
        accounts[0],
        [
          {
            type: "INTEGRITY_CHECKPOINT",
            payload: {
              Id: "a2fcb07a-65ea-48f3-a05b-d6ae9850fde6",
              Ipfs: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
              Permalink:
                "https://api.example.com/logs/integrity/a2fcb07a-65ea-48f3-a05b-d6ae9850fde6"
            },
            meta: {
              adapter: "I"
            }
          },
          {
            type: "JWT_SIGNATURE",
            payload: {
              address: "0x41f964a1c174a161f48196b85261efaef01cd30d",
              jwt:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
              authority: "https://api.example.com/auth"
            },
            meta: {
              adapter: "I"
            }
          }
        ]
      );
      `);

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
      let events = await T.Store.writeFSAs(
        eventStore,
        eventStoreAdapter,
        relic.web3,
        accounts[0],
        [
          {
            type: "INTEGRITY_CHECKPOINT",
            payload: {
              Id: "a2fcb07a-65ea-48f3-a05b-d6ae9850fde6",
              Ipfs: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
              Permalink:
                "https://api.example.com/logs/integrity/a2fcb07a-65ea-48f3-a05b-d6ae9850fde6"
            },
            meta: {
              adapter: "I"
            }
          },
          {
            type: "JWT_SIGNATURE",
            payload: {
              address: "0x41f964a1c174a161f48196b85261efaef01cd30d",
              jwt:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
              authority: "https://api.example.com/auth"
            },
            meta: {
              adapter: "I"
            }
          }
        ]
      );
      await writeFile("./Events.json", JSON.stringify(events, null, 2));
      vorpal.logger.info(JSON.stringify(events, null, 2));
      callback();
    });

  return vorpal;
};
