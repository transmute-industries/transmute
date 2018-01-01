export const KeyValue = {
  eventType: "test",
  keyType: "S",
  valueType: "S",
  key: "key",
  value: "value"
};

export const Address = {
  eventType: "test",
  keyType: "S",
  valueType: "A",
  key: "address",
  value: "0x00000000000000000000000001000c268181f5d90587392ff67ada1a16393fe4"
};

export const Bytes32 = {
  eventType: "test",
  keyType: "S",
  valueType: "B",
  key: "bytes32",
  value: "0x000000000000000000000000000000000000000000000000000000000000000A"
};

export const UInt = {
  eventType: "test",
  keyType: "S",
  valueType: "U",
  key: "uint",
  value: "0x0000000000000000000000000000000000000000000000000000000000000000"
};

export const Adapter1 = {
  eventType: "test",
  keyType: "S",
  valueType: "N",
  key: "sha1",
  value: "6e37fcc805e971f2668dcda593cfba52"
};

export const Adapter2 = {
  eventType: "test",
  keyType: "S",
  valueType: "I",
  key: "multihash",
  value: "0xce66b612ec7e1f01b62cece1b4849716005c37af4f6b578f8b9d69dbc68a7e46"
};

export default [KeyValue, Address, Bytes32, UInt, Adapter1, Adapter2];
