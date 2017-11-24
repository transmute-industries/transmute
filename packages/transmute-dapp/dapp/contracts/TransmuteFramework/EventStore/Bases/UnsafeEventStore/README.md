# Unsafe EventStore

This contract and factory do not implement any security, however, they can be used as base contracts, and as long as writeEvent is protected properly with business or domain logic, they can be used, if extended an secured properly. 

### DO NOT USE THESE

Unless you are just experimenting, or have added security to them.