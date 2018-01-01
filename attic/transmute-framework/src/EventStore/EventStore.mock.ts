export const fsaCommands = [
  // address
  {
    type: "ADDRESS_KEY_VALUE",
    payload: {
      address: "0x1a63f28550ae27e0a192d91d073ea4e97dd089b0"
    }
  },
  {
    type: "ADDRESS_KEY_VALUE",
    payload: {
      address: "1a63f28550ae27e0a192d91d073ea4e97dd089b0"
    },
    error: true
  },
  {
    // invalid hex
    type: "ADDRESS_KEY_VALUE",
    payload: {
      address: "0x1a6zf28550ae27e0a192d91d073ea4e97dd089b0"
    },
    error: true
  },
  {
    // 39 hex chars
    type: "ADDRESS_KEY_VALUE",
    payload: {
      address: "0x1a63f28550ae27e0a192d91d073ea4e97dd089b"
    },
    error: true
  },
  {
    // 41 hex chars
    type: "ADDRESS_KEY_VALUE",
    payload: {
      address: "0x1a63f28550ae27e0a192d91d073ea4e97dd089b00"
    },
    error: true
  },
  // uint
  {
    type: "UINT_KEY_VALUE",
    payload: {
      code: 1337
    }
  },
  {
    type: "BYTES32_KEY_VALUE",
    payload: {
      bytes32: "dog"
    }
  },
  {
    type: "BYTES32_KEY_VALUE",
    payload: {
      bytes32: "0x0fa2389"
    }
  },
  {
    type: "BYTES32_KEY_VALUE",
    payload: {
      // 64 byte
      bytes32:
        "0x8100000000000000000000000000000000000000000000000000000000000001"
    }
  },
  {
    type: "BYTES32_KEY_VALUE",
    payload: {
      bytes32:
        "0x80000000000000000000000000000000000000000000000000000000000000001"
    },
    error: true
  },
  {
    type: "BYTES32_KEY_VALUE",
    payload: {
      bytes32: "0xdog"
    },
    error: true
  },
  {
    type: "IPLD_OBJECT",
    payload: {
      name: "hodor",
      class: "ogre",
      inventory: ["axe"]
    }
  }
]
