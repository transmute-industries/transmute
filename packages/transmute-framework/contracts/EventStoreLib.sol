pragma solidity ^0.4.19;

library EventStoreLib {

    event TransmuteEvent(
        uint index,
        address sender,
        bytes32 key,
        bytes32 value
    );

    struct TransmuteEventStruct {
        uint index;
        address sender;
        bytes32 key;  
        bytes32 value; 
    }

    struct TransmuteStorage {
        TransmuteEventStruct[] events;
    }

    function write(
        TransmuteStorage storage self,
        bytes32 key,
        bytes32 value
    ) public returns (uint) {
        TransmuteEventStruct memory evt;
        evt.index = self.events.length;
        evt.sender = msg.sender;
        evt.key = key;
        evt.value = value;
        emit TransmuteEvent(evt.index, evt.sender, evt.key, evt.value);
        self.events.push(evt);
        return evt.index;
    }

    function read(TransmuteStorage storage self, uint index) public constant
    returns (uint, address, bytes32, bytes32 ) {
        TransmuteEventStruct memory evt = self.events[index];
        return (
            evt.index,
            evt.sender,
            evt.key,
            evt.value
        );
    }   
}
