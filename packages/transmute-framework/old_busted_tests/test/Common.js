const bs58 = require('bs58');
const web3 = require('web3');
const util = require('ethereumjs-util');

const toAscii = (value) => {
    return web3.utils.toAscii(value).replace(/\u0000/g, '')
}

const isVmException = (e) => {
    return e.toString().indexOf('VM Exception while') !== -1
}

const isTypeError = (e) => {
    return e.toString().indexOf('TypeError') !== -1
}


const grantItemFromEvent = (event) => {
    return {
        role: toAscii(event.role),
        resource: toAscii(event.resource),
        action: toAscii(event.action),
        attributes: event.attributes.map(toAscii)
    }
}

const grantItemFromValues = (values) => {
    return {
        role: toAscii(values[0]),
        resource: toAscii(values[1]),
        action: toAscii(values[2]),
        attributes: values[3].map(toAscii)
    }
}

const permissionFromCanRoleActionResourceValues = (values) => {
    return {
        granted: values[0],
        resource: toAscii(values[2]),
        attributes: values[0] ? ['*'] : [],
        _: {
            role: toAscii(values[1]),
            resource: toAscii(values[2]),
            attributes: values[0] ? ['*'] : [] // values[3].map(toAscii)
        }
    }
}


// https://blog.stakeventures.com/articles/smart-contract-terms
const hex2ipfshash = (hash) => {
    return bs58.encode(new Buffer("1220" + hash.slice(2), 'hex'))
}

const ipfs2hex = (ipfshash) => {
    return "0x" + new Buffer(bs58.decode(ipfshash).slice(2)).toString('hex');
}

const convertValueToType = (_valueType, _value) => {
    // 'I' Encodes that this is IPLD, so we know to remove Qm (and add it back)
    if (_valueType === 'I') {
        _value = ipfs2hex(_value)
    }
    // Left padd ints and addresses for bytes32 equivalence of Solidity casting
    if (_valueType === 'U' || _valueType === 'A') {
        _value = util.bufferToHex(util.setLengthLeft(_value, 32))
    }
    return _value
}

const getValueFromType = (type, value) => {
    switch (type) {
        case 'A': return '0x' + value.split('0x000000000000000000000000')[1]
        case 'U': return web3.utils.hexToNumber(value)
        case 'B': return value
        case 'X': return toAscii(value)
        case 'I': return hex2ipfshash(value)
    }
}


const marshal = (_eventType, _keyType, _valueType, _key, _value) => {
    return {
        eventType: _eventType,
        keyType: _keyType,
        valueType: _valueType,
        key: convertValueToType(_keyType, _key),
        value: convertValueToType(_valueType, _value)
    }
}

const getUnmarshalledObjectFromValues = (_id, _txOrigin, _created, _eventType, _keyType, _valueType, _key, _value) => {
    _keyType = toAscii(_keyType)
    _valueType = toAscii(_valueType)
    _key = getValueFromType(_keyType, _key)
    _value = getValueFromType(_valueType, _value)
    return {
        id: _id.toNumber(),
        txOrigin: _txOrigin,
        created: _created.toNumber(),
        eventType: toAscii(_eventType),
        keyType: _keyType,
        valueType: _valueType,
        key: _key,
        value: _value
    }
}

const unmarshal = (eventArgs) => {
    return getUnmarshalledObjectFromValues(
        eventArgs.Id,
        eventArgs.TxOrigin,
        eventArgs.Created,
        eventArgs.EventType,
        eventArgs.KeyType,
        eventArgs.ValueType,
        eventArgs.Key,
        eventArgs.Value
    )
}

const getFSAFromEventValues = (_id, _txOrigin, _created, _eventType, _keyType, _valueType, _key, _value) => {
    let flat = getUnmarshalledObjectFromValues(_id, _txOrigin, _created, _eventType, _keyType, _valueType, _key, _value)
    return {
        type: flat.eventType,
        payload: {
            [flat.key]: flat.value
        },
        meta: {
            id: flat.id,
            created: flat.created,
            txOrigin: flat.txOrigin
        }
    }
}

const getFSAFromEventArgs = (eventArgs) => {
    let flat = unmarshal(eventArgs)
    return {
        type: flat.eventType,
        payload: {
            [flat.key]: flat.value
        },
        meta: {
            id: flat.id,
            created: flat.created,
            txOrigin: flat.txOrigin
        }
    }
}


module.exports = {
    toAscii,
    convertValueToType,
    marshal,
    unmarshal,
    getFSAFromEventArgs,
    getFSAFromEventValues,

    grantItemFromEvent,
    grantItemFromValues,
    permissionFromCanRoleActionResourceValues,

    isVmException,
    isTypeError
}
