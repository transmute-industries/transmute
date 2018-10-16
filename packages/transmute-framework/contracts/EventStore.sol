pragma solidity ^0.4.19;

contract EventStore {
    uint public count;

    event TransmuteEvent(
        uint index,
        address indexed sender,
        bytes32 contentHash
    );

    function write(bytes32 contentHash) external {
        emit TransmuteEvent(count, msg.sender, contentHash);
        count++;
    }
}
