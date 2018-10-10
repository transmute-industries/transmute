const { generateDID } = require('../helper.js');
const dli = require('../tst-decentralized-ledger-interface.js');
const didResolver = require('did-resolver');
const { resolve, register } = require('../tst-did-resolver.js');

let did1, didDocument1;
let did2;

beforeAll(async () => {
    const identity1 = await generateDID();
    did1 = identity1.did;
    didDocument1 = identity1.didDocument;
    await dli.create(did1, didDocument1);
    const identity2 = await generateDID();
    did2 = identity2.did;
});

describe('resolve', () => {
    it('should return the right DID document from the ledger', async () => {
        expect.assertions(1);
        await expect(resolve(did1)).resolves.toBe(didDocument1);
    });

    it('should fail if DID has not been created before', async () => {
        expect.assertions(1);
        await expect(resolve(did2)).rejects.toBeInstanceOf(Error);
    });
});

describe('register', () => {
    it('should register the tst resolver in the universal DID resolver', async () => {
        expect.assertions(2);
        await expect(didResolver(did1)).rejects.toBeInstanceOf(Error);
        register('tst', resolve);
        await expect(didResolver(did1)).resolves.toBe(didDocument1);
    });
});
