import * as Web3 from "web3";
import * as util from "ethereumjs-util";
describe("Utils", () => {
  it("util.ecsign + util.ecrecover work as expected", () => {
    const privkey = new Buffer(
      "3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1",
      "hex"
    );
    const data = util.sha3("a");
    const vrs = util.ecsign(data, privkey);
    const pubkey = util.ecrecover(data, vrs.v, vrs.r, vrs.s);
    // recovered public key matches private key used to sign
    const check1 =
      pubkey.toString("hex") === util.privateToPublic(privkey).toString("hex");
    const check2 =
      util.publicToAddress(pubkey).toString("hex") ===
      util.privateToAddress(privkey).toString("hex");
    // recovered address matches private address used to sign
    expect(check1 && check2).toBe(true);
  });
});
