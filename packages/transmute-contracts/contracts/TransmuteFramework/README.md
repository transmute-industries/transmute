
## EventStore

This contract and factory follow an immutable whitelist for determining who may or may not write events. 
The whitelist is instantiated once.
The contract owner can always write events, and ownership of both factory and store can be transfered.
