pragma solidity ^0.4.17;

library EventStoreLib {

    event TransmuteEvent(
        address sender,
        bytes32 key,
        bytes32 value
    );

    struct TransmuteEventStruct {
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
        uint index = self.events.length;
        TransmuteEventStruct memory evt;
        evt.sender = msg.sender;
        evt.key = key;
        evt.value = value;
        TransmuteEvent(evt.sender, evt.key, evt.value);
        self.events.push(evt);
        return index;
    }

    function read(TransmuteStorage storage self, uint index) public constant
    returns (address, bytes32, bytes32 ) {
        TransmuteEventStruct memory evt = self.events[index];
        return (
            evt.sender,
            evt.key,
            evt.value
        );
    }

   
}
