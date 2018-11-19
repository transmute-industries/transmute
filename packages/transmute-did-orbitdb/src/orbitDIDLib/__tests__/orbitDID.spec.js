const orbitDIDLib = require('../index');

describe('orbitDID', () => {
  beforeAll(async () => {});

  describe('orbitdbAddressToDID', () => {
    it('converts an orbit address for to a did', async () => {
      expect(
        orbitDIDLib.orbitdbAddressToDID(
          '/orbitdb/QmTjTQfsuSiMrMwzjLUZH4fgZAdmsML4aP1Ms6DTrhT4zb/did:transmute.openpgp:6075f9ad86de29d7644752c95e7379e3e5e4a806',
        ),
      ).toEqual(
        'did:orbitdb.transmute.openpgp:QmTjTQfsuSiMrMwzjLUZH4fgZAdmsML4aP1Ms6DTrhT4zb.6075f9ad86de29d7644752c95e7379e3e5e4a806',
      );
    });
  });

  describe('orbitDBDIDToOrbitDBAddress', () => {
    it('converts an orbit did for an orbit address', async () => {
      expect(
        '/orbitdb/QmTjTQfsuSiMrMwzjLUZH4fgZAdmsML4aP1Ms6DTrhT4zb/did:transmute.openpgp:6075f9ad86de29d7644752c95e7379e3e5e4a806',
      ).toEqual(
        orbitDIDLib.orbitDBDIDToOrbitDBAddress(
          'did:orbitdb.transmute.openpgp:QmTjTQfsuSiMrMwzjLUZH4fgZAdmsML4aP1Ms6DTrhT4zb.6075f9ad86de29d7644752c95e7379e3e5e4a806#kid=0x123',
        ),
      );
    });
  });
});
