pragma solidity ^0.4.17;

import "./EventStoreLib.sol";

contract EventStore {

    EventStoreLib.TransmuteStorage store;

    address public owner;
 
    function EventStore() public {
        owner = msg.sender;
    }

    function write(bytes32 key, bytes32 value) public {
        require(msg.sender == owner);
        EventStoreLib.write(
            store,
            key,
            value
        );
    }

    function read(uint index) public view
    returns (address, bytes32, bytes32 ){
        return EventStoreLib.read(store, index);
    }

    function destroy(address target) public {
        require(msg.sender == owner);
        selfdestruct(target);
    }
}