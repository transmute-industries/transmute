import { Relic, Utils } from "../transmute-framework";
import * as TransmuteCrypto from "transmute-crypto";

const RPC_HOST = "http://localhost:8545";

const generateTestWallets = async (num: number) => {
  const sodium = await TransmuteCrypto.getSodium();
  let testWallets: any = [];
  for (let i = 0; i < num; i++) {
    const alice = sodium.crypto_box_keypair();
    const unPrefixedPrivateKeyHexString = sodium.to_hex(alice.privateKey);
    let address = Utils.privateKeyHexToAddress("0x" + unPrefixedPrivateKeyHexString);
    testWallets.push({
      address: "0x" + sodium.to_hex(address),
      privateKey: "0x" + unPrefixedPrivateKeyHexString
    });
  }
  return testWallets;
};

/**
 * Relic tests
 */
describe("Relic tests", () => {
  const allWalletBalancesAre = async (relic, testWallets, expectedBalanceWei: number) => {
    testWallets.forEach(async wallet => {
      let bal = await relic.getBalance(wallet.address);
      expect(bal).toBe(expectedBalanceWei);
    });
  };
  const fundWallets = async (relic, defaultAccount, testWallets, amountWei: number) => {
    testWallets.forEach(async wallet => {
      let txhash = await relic.sendWei(defaultAccount, wallet.address, amountWei);
      expect(txhash).toBeDefined();
    });
  };
  // it("relic supports default accounts", async () => {
  //   let relic = new Relic({
  //     providerUrl: RPC_HOST
  //   });
  //   let accounts = await relic.getAccounts();
  //   expect(accounts.length).toBe(10);
  // });

  // it("relic supports wallet accounts", async () => {
  //   const sodium = await TransmuteCrypto.getSodium();
  //   const alice = sodium.crypto_box_keypair();
  //   const unPrefixedPrivateKeyHexString = sodium.to_hex(alice.privateKey);
  //   const wallet = TransmuteCrypto.getWalletFromPrivateKey(unPrefixedPrivateKeyHexString);
  //   let relic = new Relic({
  //     providerUrl: RPC_HOST,
  //     wallet
  //   });
  //   let accounts = await relic.getAccounts();
  //   expect(accounts.length).toBe(1);
  // });

  it("can easily fund wallet addresses", async () => {
    let relic = new Relic({
      providerUrl: RPC_HOST
    });
    let defaultAccount = (await relic.getAccounts())[0];
    let testWallets = await generateTestWallets(3);
    await allWalletBalancesAre(relic, testWallets, 0);
    await fundWallets(relic, defaultAccount, testWallets, 150000000000000000);
    await allWalletBalancesAre(relic, testWallets, 150000000000000000);
  });

  // it("can easily fund wallet addresses", async () => {
  //   // let relic = new Relic({
  //   //   providerUrl: RPC_HOST
  //   // });
  //   // let defaultAccount = (await relic.getAccounts())[0];
  //   // let testWallets = await generateTestWallets(3);
  //   // // // console.log(testWallets)
  //   // await allWalletBalancesAre(relic, testWallets, 0);
  //   // await fundWallets(relic, defaultAccount, testWallets, 150000000000000000);
  //   // await allWalletBalancesAre(relic, testWallets, 150000000000000000);

  //   // const wallet = TransmuteCrypto.getWalletFromPrivateKey(unPrefixedPrivateKeyHexString);
  //   // let relic = new Relic({
  //   //   providerUrl: RPC_HOST,
  //   //   wallet
  //   // });
  //   // let accounts = await relic.getAccounts();
  //   // expect(accounts.length).toBe(1);

  //   // console.log("yea");
  // });
});
