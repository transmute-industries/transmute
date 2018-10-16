pragma solidity ^0.4.19;

contract EventStore {
    uint public count;

    event TransmuteEvent(
        uint index,
        address indexed sender,
        bytes32 key,
        bytes32 value,
    );

    function write(bytes32 key, bytes32 value) {
        emit TransmuteEvent(count, msg.sender, key, value);
        count++;
    }
}
