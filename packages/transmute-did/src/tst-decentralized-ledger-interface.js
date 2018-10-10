// TODO: eslint error
const decentralizedLedger = {};

const create = (did, didDocument) => {
    return new Promise((resolve, reject) => {
        if (did in decentralizedLedger) {
            reject(new Error('did already exists'));
        } else {
            decentralizedLedger[did] = didDocument;
            resolve(true);
        }
    });
}

const read = (did) => {
    return new Promise((resolve, reject) => {
        if (did in decentralizedLedger) {
            resolve(decentralizedLedger[did]);
        } else {
            reject(new Error('did not found'));
        }
    })
}

// TODO: Implement when we have SideTree's algo
const update = () => {}

// Method is called revoke and not delete because
// of the immutability property of DLs
const revoke = () => {}

module.exports = {
    create,
    read
};
