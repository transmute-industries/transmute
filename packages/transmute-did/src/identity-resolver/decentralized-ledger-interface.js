// TODO: eslint error
const decentralizedLedger = {};

const create = (did, didDocument) => {
    return new Promise((resolve, reject) => {
        if (did in decentralizedLedger) {
            reject();
        } else {
            decentralizedLedger[did] = didDocument;
            resolve();
        }
    });
}

const read = (did) => {
    return new Promise((resolve, reject) => {
        if (did in decentralizedLedger) {
            resolve(decentralizedLedger[did])
        } else {
            reject();
        }
    })
}

const update = () => {}

const delete = () => {}

exports = {
    create,
    read
};
