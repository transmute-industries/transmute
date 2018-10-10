const dli = require('../tst-decentralized-ledger-interface.js');
const { generateDID } = require('../helper.js');

let did1;
let didDocument1;
let did2;

beforeAll(async () => {
  const identity1 = await generateDID();
  did1 = identity1.did;
  didDocument1 = identity1.didDocument;
  const identity2 = await generateDID();
  did2 = identity2.did;
});

describe('create', () => {
  it('should write a new did to the ledger', async () => {
    expect.assertions(3);
    await expect(dli.read(did1)).rejects.toBeInstanceOf(Error);
    await expect(dli.create(did1, didDocument1)).resolves.toBeTruthy();
    await expect(dli.read(did1)).resolves.toBe(didDocument1);
  });

  it('should fail if did is already in the ledger', async () => {
    expect.assertions(2);
    await expect(dli.read(did1)).resolves.toBe(didDocument1);
    await expect(dli.create(did1, didDocument1)).rejects.toBeInstanceOf(Error);
  });
});

describe('read', () => {
  it('should return the did if it is in the ledger', async () => {
    expect.assertions(1);
    await expect(dli.read(did1)).resolves.toBe(didDocument1);
  });

  it('should fail if did is not in the ledger', async () => {
    expect.assertions(1);
    await expect(dli.read(did2)).rejects.toBeInstanceOf(Error);
  });
});
