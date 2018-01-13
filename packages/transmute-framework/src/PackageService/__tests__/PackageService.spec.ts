import { getSetupAsync } from "../../__mocks__/setup";

import { W3, Relic, PackageService, Utils } from "../../transmute-framework";

import * as TransmuteCrypto from "transmute-crypto";



/**
 * PackageService test
 */
describe("PackageService", () => {
  let relic: any;
  let accounts: string[];
  let ps: PackageService;

  beforeAll(async () => {
    let setup = await getSetupAsync();
    relic = setup.relic;
    // accounts = setup.accounts;
    // let packageManager = await PackageService.New(accounts[0]);
    // ps = new PackageService(packageManager, setup.eventStoreAdapter);
  });

  // it("Static NewContract creates a new contract...", async () => {
  //   expect(ps.packageManager.address).toBeDefined();
  // });

  test("new users can publish packages", async () => {
    // console.log('happy', TransmuteCrypto)

    // user creates key pair
    // let sodium = await TransmuteCrypto.getSodium();
    // let alice = sodium.crypto_box_keypair();
    // let alicePrivKeyHex = '0x' + sodium.to_hex(alice.privateKey)
    // console.log(alicePrivKeyHex)
    // let aliceAddress = Utils.privateKeyHexToAddress(alicePrivKeyHex)
    // console.log(aliceAddress)


    // user registers new key pair with contract
    // relic.web3.eth.accounts.privateKeyToAccount();
    // let updatedAccount = await relic.getAccounts();
    // console.log(relic.web3.eth)

    // user publishes package to contract



  });
});
