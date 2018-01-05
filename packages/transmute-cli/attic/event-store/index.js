const path = require("path");

// import TransmuteFramework from '../../TransmuteFramework'

// const accessControlArtifacts = require('../../../build/contracts/RBAC')
// const eventStoreArtifacts = require('../../../build/contracts/RBACEventStore')
// const eventStoreFactoryArtifacts = require('../../../build/contracts/RBACEventStoreFactory')

// const { getCachedReadModel } = TransmuteFramework.EventStore

// // // need to rename these before adding other read models
// // import { readModel, reducer } from './reducer'

// import * as _ from 'lodash'

// const {
//     web3,
//     EventStoreContract,
//     EventStoreFactoryContract,
//     EventStore,
//     TransmuteIpfs
// } = TransmuteFramework.init({
//         env: 'testrpc',
//         aca: accessControlArtifacts,
//         esa: eventStoreArtifacts,
//         esfa: eventStoreFactoryArtifacts,
//     })

module.exports = vorpal => {
  vorpal
    .command("eventstore list", "List eventstores from the factory.")
    .action(async (args, callback) => {
      let T = vorpal.T;
      let addresses = await T.getAccounts();
      let address = addresses[0];
      let factory = await T.EventStoreFactoryContract.deployed();
      let factoryReadModel = await T.Factory.getFactoryReadModel(
        factory,
        address
      );
      console.log(factoryReadModel);
      callback();
    });

  // vorpal
  //     .command('eventstore create', 'Create an EventStore')
  //     .action((args, callback) => {

  //         web3.eth.getAccounts(async (err, addresses) => {
  //             if (err) { throw err }
  //             if (args.options.from === undefined) {
  //                 args.options.from = addresses[0]
  //             }
  //             let fromAddress = args.options.from
  //             let factory = await EventStoreFactoryContract.deployed()
  //             const { tx, events } = await TransmuteFramework.Factory.createEventStore(
  //                 factory,
  //                 fromAddress
  //             )
  //             const contractAddress = events[0].payload.address
  //             console.log('🎁  ' + contractAddress + ' EventStore created...')
  //             callback()
  //         })

  //     })

  // vorpal
  //     .command('eventstore permissions', 'Show an EventStore Permisssions')
  //     .option('-f, --from <from>', 'from address')
  //     .option('-c, --contractAddress <contractAddress>', 'contractAddress...')
  //     .types({
  //         string: ['contractAddress']
  //     })
  //     .action((args, callback) => {

  //         web3.eth.getAccounts(async (err, addresses) => {
  //             if (err) { throw err }
  //             if (args.options.from === undefined) {
  //                 args.options.from = addresses[0]
  //             }
  //             let fromAddress = args.options.from
  //             let bindingModel = {
  //                 contractAddress: args.options.contractAddress,
  //                 fromAddress: args.options.from
  //             }
  //             // let updatedReadModel = await syncEventStore(bindingModel);
  //             let acc = await EventStoreContract.at(bindingModel.contractAddress)
  //             let readModel = await TransmuteFramework.Permissions.getPermissionsReadModel(acc, bindingModel.fromAddress)
  //             console.log(readModel)
  //             callback()
  //         })

  //     })

  // vorpal
  //     .command('eventstore grant', 'Create a permissions grant')
  //     .option('-c, --contractAddress <contractAddress>', 'contractAddress...')
  //     .option('-g, --grant <grant>', 'grant...')
  //     .types({
  //         string: ['contractAddress']
  //     })
  //     .action((args, callback) => {

  //         web3.eth.getAccounts(async (err, addresses) => {
  //             if (err) { throw err }
  //             if (args.options.from === undefined) {
  //                 args.options.from = addresses[0]
  //             }
  //             let grant = args.options.grant.split(",")
  //             // console.log(grant)
  //             let bindingModel = {
  //                 contractAddress: args.options.contractAddress,
  //                 fromAddress: args.options.from
  //             }
  //             let acc = await EventStoreContract.at(bindingModel.contractAddress)

  //             let role: string = grant[0]
  //             let resource: string = grant[1]
  //             let action: string = grant[2]

  //             let attributes: string[] = eval(grant[3])
  //             // console.log(role, resource, action, attributes)
  //             let { tx, events } = await TransmuteFramework.Permissions.setGrant(
  //                 acc,
  //                 bindingModel.fromAddress,
  //                 role,
  //                 resource,
  //                 action,
  //                 attributes
  //             )
  //             // console.log(events)
  //             let readModel = await TransmuteFramework.Permissions.getPermissionsReadModel(acc, bindingModel.fromAddress)
  //             console.log(readModel)
  //             callback()
  //         })

  //     })

  //     vorpal
  //     .command('eventstore can', 'Can role action resource')
  //     .option('-c, --contractAddress <contractAddress>', 'contractAddress...')
  //     .option('-q, --query <query>', 'query...')
  //     .types({
  //         string: ['contractAddress']
  //     })
  //     .action((args, callback) => {

  //         web3.eth.getAccounts(async (err, addresses) => {
  //             if (err) { throw err }
  //             if (args.options.from === undefined) {
  //                 args.options.from = addresses[0]
  //             }
  //             let query = args.options.query.split(",")
  //             // console.log(query)
  //             let bindingModel = {
  //                 contractAddress: args.options.contractAddress,
  //                 fromAddress: args.options.from
  //             }
  //             let acc = await EventStoreContract.at(bindingModel.contractAddress)

  //             let role: string = query[0]
  //             let action: string = query[1]
  //             let resource: string = query[2]

  //             let granted = await TransmuteFramework.Permissions.canRoleActionResource(
  //                 acc,
  //                 bindingModel.fromAddress,
  //                 role,
  //                 action,
  //                 resource
  //             )
  //             console.log(granted ? 'yes ': 'no ', role, ' can ', action,  resource)

  //             callback()
  //         })

  //     })

  // vorpal
  //     .command('eventstore write', 'Write an Event to an EventStore')
  //     .option('-f, --from <from>', 'from address')
  //     .option('-c, --contractAddress <contractAddress>', 'contractAddress...')
  //     .option('-t, --type <type>', 'event type')
  //     .option('-p, --payload <payload>', 'event payload')
  //     .types({
  //         string: ['contractAddress']
  //     })
  //     .action((args, callback) => {

  //         web3.eth.getAccounts(async (err, addresses) => {
  //             if (err) { throw err }
  //             if (args.options.from === undefined) {
  //                 args.options.from = addresses[0]
  //             }
  //             let fromAddress = args.options.from
  //             let bindingModel = {
  //                 contractAddress: args.options.contractAddress,
  //                 fromAddress: args.options.from,
  //                 event: {
  //                     type: args.options.type,
  //                     payload: args.options.payload
  //                 }
  //             }

  //             // let updatedReadModel = await writeEvent(bindingModel);
  //             // console.log(updatedReadModel)
  //             callback()
  //         })

  //     })

  return vorpal;
};
