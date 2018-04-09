pragma solidity ^0.4.19;

import "./EventStore.sol";

contract EventStoreFactory {

    address[] public eventStores;

    address public owner;

    function () public payable { revert(); }
 
    function EventStoreFactory() public {
        owner = msg.sender;
    }

    function createEventStore() public returns (address) {
        EventStore eventStore = new EventStore();
        eventStores.push(address(eventStore));
        return address(eventStore);
    }

    function getEventStores() public view returns (address[]) {
        return eventStores;
    }
}