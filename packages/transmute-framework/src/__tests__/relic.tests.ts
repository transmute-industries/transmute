import { Relic } from "../transmute-framework";
import * as TransmuteCrypto from "transmute-crypto";

const RPC_HOST = "http://localhost:8545";
/**
 * Relic tests
 */
describe("Relic tests", () => {
  it("relic supports default accounts", async () => {
    let relic = new Relic({
      providerUrl: RPC_HOST
    });
    let accounts = await relic.getAccounts();
    expect(accounts.length).toBe(10);
  });

  it("relic supports wallet accounts", async () => {

    const sodium = await TransmuteCrypto.getSodium();
    const alice = sodium.crypto_box_keypair();
    const unPrefixedPrivateKeyHexString = sodium.to_hex(alice.privateKey);
    const wallet = TransmuteCrypto.getWalletFromPrivateKey(unPrefixedPrivateKeyHexString);

    let relic = new Relic({
      providerUrl: RPC_HOST,
      wallet
    });

    let accounts = await relic.getAccounts();
    expect(accounts.length).toBe(1);
  });
});
