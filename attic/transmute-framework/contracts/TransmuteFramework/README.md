# Event Sourcing

The contracts in this directory are to be used as base contracts for building event sourced decentralized applications. At present, we have a few variant EventStore contracts which implement varying levels of security.

## Unsafe EventStore

This contract and factory do not implement any security, however, as long as writeEvent is protected properly with business or domain logic, they can be used.

## RBACEventStore

This contract and factory extend the RBAC contract (Role-Based Access Control). It follows the methodology of assigning grants for users with specific roles to perform actions on various attributes of a resource. If a user attempts to write an event relating to an attribute on a resource and does not have a grant relating to their role allowing them to do so, their attempt will be rejected.

This contract has not undergone a security audit and any consumer is advised to consume this at their own risk.

## EventStore

This contract and factory follow an immutable whitelist for determining who may or may not write events. The whitelist is instantiated in the EventStore constructor and may not be edited.
