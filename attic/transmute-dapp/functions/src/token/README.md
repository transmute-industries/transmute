# Token Function


### Requests

```
/token?method=challenge&address=0xd39d9b02eb50e9b1ae311ccc0c1c0a9afad382fb&message_raw=0x43ebbb8cff55327bb7421bb265b68a810f7733e3546718fefcce51feda10da3d&message_hex=0x7472616e736d7574652e636c692e6c6f67696e&message_signature=0x592c8a2e22beb563917ce5aa7d9382972dc0638565dd630af7ee7bc20e84fa8e5f9a152de9a6cc220dfe6ca805b428175633105bb1478ff3c629e371d47fefd000

/token?method=verify&address=0xd39d9b02eb50e9b1ae311ccc0c1c0a9afad382fb&message_raw=0x020d9ff66680c4d73cc2a72261ede51070bb760bc5e344dc66ddb13da0a2c497&message_hex=0x64313937363037642d323435362d343663382d386361662d6535336637323039363731362e307864333964396230326562353065396231616533313163636330633163306139616661643338326662&message_signature=0x09932ce91994a5130f524738cbd6c48eb45c9c7dfc0417c703e6c8eb5bb3461f4c7c5404c749f9eb487c48070a789e22c781a8d33edb10daa3e8c3074ec7e18801
```

### Summary

The client signs message `"transmute.cli.login"` with their address and sends it to the server.

The server verifies message was signed with the supplied address, and then constructs the challenge `${uuid}.${client_address}.${client_message_hex}`, signs, stores and returns the challenge.

The client signs the challenge, and sends the signature to the server.

The server checks sigs and returns a token if the client was able to sign their challenge with the address used to generate the challenge.
