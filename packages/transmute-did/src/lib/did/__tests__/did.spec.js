const didLib = require('../index');

const didMethods = require('../constants').didMethods;

const ethereumKeypair = {
  publicKey:
    'a3a757304f5ca97101385a630a5334d2594016cf408645c592ad265c084a197d1b79d9b10dd918ae565f16db67535e26a7c687285ce38d713c45aa930cea3931',
  privateKey: 'dc3c988f747197e3b967933b52bf30f4e4a04821fdae726c00877180325cf770',
};

const openpgpKeypair = {
  publicKey:
    '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW5fxLhMFK4EEAAoCAwTYLueHwRJAX/JVmYBVscOPb7eYG/EwLvC5/7Ce\nHG5SlrIXclvf9Fh9GhV3nQd/D5vxWjSF4Ud+KYzHUKS8ZOaXzQNib2LCdwQQ\nEwgAKQUCW5fxLgYLCQcIAwIJEKoktMp6PshzBBUICgIDFgIBAhkBAhsDAh4B\nAABl+gD/ajcrBy5REJgqUSSncvaFHNJbFOgf4nd7emD9/U3aNSEBAIJwQh5J\np+FO1fz1Nz58hc5HS9XXswNmO79qUieA38ZdzlMEW5fxLhIFK4EEAAoCAwQ4\nukATZ1Ph5fjXJaly1OvYWedx9HTIHWJGsQYZ9YyqbR9iASmadeRSGLDBB38X\n9jX8dvupyVigMXi4XsbTG26AAwEIB8JhBBgTCAATBQJbl/EuCRCqJLTKej7I\ncwIbDAAA0HcBAKh+wK4C5LMAeVFMB8s5XM5UEyPK2fAa35rfxbq/n+1rAQDC\na6Nrpc7sAkhXxh4IdRmB3WKJkckJ4AiA7vu6L1UEgA==\r\n=HRUx\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n',
  privateKey:
    '-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxaIEW5fxLhMFK4EEAAoCAwTYLueHwRJAX/JVmYBVscOPb7eYG/EwLvC5/7Ce\nHG5SlrIXclvf9Fh9GhV3nQd/D5vxWjSF4Ud+KYzHUKS8ZOaX/gkDCCBZW03P\nze+KYFfpKHgr9XGe345lATcy0rr1yhlViz/Z/e1szPqqOX0XEEnHSz46lo6l\nrsxSn5K8sE838SM8rkM0bhgB6Vg0LEralBA2cUrNA2JvYsJ3BBATCAApBQJb\nl/EuBgsJBwgDAgkQqiS0yno+yHMEFQgKAgMWAgECGQECGwMCHgEAAGX6AP9q\nNysHLlEQmCpRJKdy9oUc0lsU6B/id3t6YP39Tdo1IQEAgnBCHkmn4U7V/PU3\nPnyFzkdL1dezA2Y7v2pSJ4Dfxl3HpgRbl/EuEgUrgQQACgIDBDi6QBNnU+Hl\n+NclqXLU69hZ53H0dMgdYkaxBhn1jKptH2IBKZp15FIYsMEHfxf2Nfx2+6nJ\nWKAxeLhextMbboADAQgH/gkDCD0NdSj74x0BYD2DxuSb1JfKwG3nzEoFzG4u\nuDOETmKcUYlNjsx6fH76wI9KH1GvhURzyEeVncs+xfPt2Bu6gZTrA1eHkoAF\nK4Au+zdVkdPCYQQYEwgAEwUCW5fxLgkQqiS0yno+yHMCGwwAANB3AQCofsCu\nAuSzAHlRTAfLOVzOVBMjytnwGt+a38W6v5/tawEAwmuja6XO7AJIV8YeCHUZ\ngd1iiZHJCeAIgO77ui9VBIA=\r\n=6N7L\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n',
};

const orbitdbKeypair = {
  publicKey:
    '04c44cb158a11cd03f30b713276faf8cf8869fccb2a48662dc43fcde61af5008040270257a3734f47acbb1bf2def85b7a4c0d213ab634bc2e79dbc4c1916d45a4f',
  privateKey: 'ef3ff305e9492fa7904eb3c671df5f683c68548153bc8d6cf2dc663f06e13dfe',
};

describe('did-spec', () => {
  describe('publicKeyToDID', () => {
    it('supports ethereum', async () => {
      const did = await didLib.publicKeyToDID('ethereum', ethereumKeypair.publicKey);
      expect(did.indexOf(didMethods.ETHEREUM)).toBe(4);
    });

    it('supports openpgp', async () => {
      const did = await didLib.publicKeyToDID('openpgp', openpgpKeypair.publicKey);
      expect(did.indexOf(didMethods.OPENPGP)).toBe(4);
    });

    it('supports orbitdb', async () => {
      const did = await didLib.publicKeyToDID('orbitdb', orbitdbKeypair.publicKey);
      expect(did.indexOf(didMethods.ORBITDB)).toBe(4);
    });
  });
});
