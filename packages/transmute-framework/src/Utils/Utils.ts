const bs58 = require("bs58");
const web3Utils = require("web3-utils");
const util = require("ethereumjs-util");

export const toAscii = (value: string) => {
  return util.toAscii(value).replace(/\u0000/g, "");
};

export const isValidAddress = (address: string) => {
  return util.isValidAddress(address);
};

export const bufferToHex = (buffer: Buffer) => {
  return util.bufferToHex(buffer);
};

export const setLengthLeft = (_value: string, size: number) => {
  return util.setLengthLeft(_value, size);
};

// https://blog.stakeventures.com/articles/smart-contract-terms
export const hex2ipfshash = (hash: any) => {
  return bs58.encode(new Buffer("1220" + hash.slice(2), "hex"));
};

export const ipfs2hex = (ipfshash: any) => {
  return "0x" + new Buffer(bs58.decode(ipfshash).slice(2)).toString("hex");
};

export const isHex = (h: any) =>
  h.replace(/^0x/i, "").match(/[0-9A-Fa-f]+$/)
    ? h.replace(/^0x/i, "").match(/[0-9A-Fa-f]+$/)["index"] === 0
    : false;

export const formatHex = (h: any) => "0x" + h.replace(/^0x/i, ""); // assumes valid hex input .. 0x33/33 -> 0x33

export const hexToNumber = (h: any) => {
  return web3Utils.hexToNumber(h);
};

export const privateKeyHexToAddress = (privatKeyHex: any) => {
  return util.privateToAddress(privatKeyHex);
};
