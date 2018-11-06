const base64url = require('base64url');

const { createDIDDocumentFromPublicKey } = require('../../../../did');

const { getMessagePayload } = require('../../../../cryptoHelpers');

const { openpgpSignJson, openpgpVerifyJson } = require('../index');

const pack = require('../../../../../../../package.json');

const openpgpVersion = `openpgp@${pack.dependencies.openpgp}`;

// Alice
const A = {
  publicKey:
    '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW5fxLhMFK4EEAAoCAwTYLueHwRJAX/JVmYBVscOPb7eYG/EwLvC5/7Ce\nHG5SlrIXclvf9Fh9GhV3nQd/D5vxWjSF4Ud+KYzHUKS8ZOaXzQNib2LCdwQQ\nEwgAKQUCW5fxLgYLCQcIAwIJEKoktMp6PshzBBUICgIDFgIBAhkBAhsDAh4B\nAABl+gD/ajcrBy5REJgqUSSncvaFHNJbFOgf4nd7emD9/U3aNSEBAIJwQh5J\np+FO1fz1Nz58hc5HS9XXswNmO79qUieA38ZdzlMEW5fxLhIFK4EEAAoCAwQ4\nukATZ1Ph5fjXJaly1OvYWedx9HTIHWJGsQYZ9YyqbR9iASmadeRSGLDBB38X\n9jX8dvupyVigMXi4XsbTG26AAwEIB8JhBBgTCAATBQJbl/EuCRCqJLTKej7I\ncwIbDAAA0HcBAKh+wK4C5LMAeVFMB8s5XM5UEyPK2fAa35rfxbq/n+1rAQDC\na6Nrpc7sAkhXxh4IdRmB3WKJkckJ4AiA7vu6L1UEgA==\r\n=HRUx\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n',
  privateKey:
    '-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxaIEW5fxLhMFK4EEAAoCAwTYLueHwRJAX/JVmYBVscOPb7eYG/EwLvC5/7Ce\nHG5SlrIXclvf9Fh9GhV3nQd/D5vxWjSF4Ud+KYzHUKS8ZOaX/gkDCCBZW03P\nze+KYFfpKHgr9XGe345lATcy0rr1yhlViz/Z/e1szPqqOX0XEEnHSz46lo6l\nrsxSn5K8sE838SM8rkM0bhgB6Vg0LEralBA2cUrNA2JvYsJ3BBATCAApBQJb\nl/EuBgsJBwgDAgkQqiS0yno+yHMEFQgKAgMWAgECGQECGwMCHgEAAGX6AP9q\nNysHLlEQmCpRJKdy9oUc0lsU6B/id3t6YP39Tdo1IQEAgnBCHkmn4U7V/PU3\nPnyFzkdL1dezA2Y7v2pSJ4Dfxl3HpgRbl/EuEgUrgQQACgIDBDi6QBNnU+Hl\n+NclqXLU69hZ53H0dMgdYkaxBhn1jKptH2IBKZp15FIYsMEHfxf2Nfx2+6nJ\nWKAxeLhextMbboADAQgH/gkDCD0NdSj74x0BYD2DxuSb1JfKwG3nzEoFzG4u\nuDOETmKcUYlNjsx6fH76wI9KH1GvhURzyEeVncs+xfPt2Bu6gZTrA1eHkoAF\nK4Au+zdVkdPCYQQYEwgAEwUCW5fxLgkQqiS0yno+yHMCGwwAANB3AQCofsCu\nAuSzAHlRTAfLOVzOVBMjytnwGt+a38W6v5/tawEAwmuja6XO7AJIV8YeCHUZ\ngd1iiZHJCeAIgO77ui9VBIA=\r\n=6N7L\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n',
};

// Bob
const B = {
  publicKey:
    '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW5fxixMFK4EEAAoCAwRsP0I/2xeH+E5nIeZWmfTV7z4fqY2PDz9u/52a\n/MvZmh1aUHMcSiYeKO0YS4GCPLJetlPmGQtdgZ0P1IHP+5e3zQNib2LCdwQQ\nEwgAKQUCW5fxiwYLCQcIAwIJEKXlARzehQEPBBUICgIDFgIBAhkBAhsDAh4B\nAADUUwD+PQX043J67iiIEnE3MkKDlaFY2bBHcoh9YQTSZ9ZVUKMBAONfBW1s\nNOeQnJCjHsfNbvE0tylkHiSv2TCPuGKDhw2rzlMEW5fxixIFK4EEAAoCAwT/\nThRoRbtoRcCnxUZUCzw6+KPQLIvh4ZO9+NiTEM4NUwSxuCx2mBhaSYHhZkcs\nHIvj8G5IOGoZVWQ8qawL8PDkAwEIB8JhBBgTCAATBQJbl/GLCRCl5QEc3oUB\nDwIbDAAANdwA/RzA4cnGmfIblhBw+5Qq2fF7/JeNctN2nhwrl8yNgeglAP4u\nmoTqXbbP7niojJEqWsliT3ooR3//hYaIgBqkSj6nFw==\r\n=Jbqj\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n',
  privateKey:
    '-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxaIEW5fxixMFK4EEAAoCAwRsP0I/2xeH+E5nIeZWmfTV7z4fqY2PDz9u/52a\n/MvZmh1aUHMcSiYeKO0YS4GCPLJetlPmGQtdgZ0P1IHP+5e3/gkDCPBrZGGt\nJ+y6YDemZVmKmFg6IZz2iHC5ANjLwo/Wsni5iWBHzaukoyW22RldqPDJhfTv\n4lDNdS06FmPiPrp/MBCfpUMuLSlJrSD52oHWsiDNA2JvYsJ3BBATCAApBQJb\nl/GLBgsJBwgDAgkQpeUBHN6FAQ8EFQgKAgMWAgECGQECGwMCHgEAANRTAP49\nBfTjcnruKIgScTcyQoOVoVjZsEdyiH1hBNJn1lVQowEA418FbWw055CckKMe\nx81u8TS3KWQeJK/ZMI+4YoOHDavHpgRbl/GLEgUrgQQACgIDBP9OFGhFu2hF\nwKfFRlQLPDr4o9Asi+Hhk7342JMQzg1TBLG4LHaYGFpJgeFmRywci+Pwbkg4\nahlVZDyprAvw8OQDAQgH/gkDCEpFEtVORboWYC6RRYrxAq25mrD2Z/oaUYnX\naOLfogFwMJ96l8O9HfHqdr4mfq9MO36ul3LkKdu9CT0Z6+YmmUwKttWznY5b\nG9iv3hdUCD/CYQQYEwgAEwUCW5fxiwkQpeUBHN6FAQ8CGwwAADXcAP0cwOHJ\nxpnyG5YQcPuUKtnxe/yXjXLTdp4cK5fMjYHoJQD+LpqE6l22z+54qIyRKlrJ\nYk96KEd//4WGiIAapEo+pxc=\r\n=1QUt\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n',
};

const testObject = {
  foo: 'bar',
};

const passphrase = 'yolo';

describe('did openpgp ocap-ld', () => {
  let ADoc;
  let BDoc;

  let signedObjectA;
  let signedObjectB;

  beforeAll(async () => {
    ADoc = JSON.parse(await createDIDDocumentFromPublicKey(A.publicKey));
    BDoc = JSON.parse(await createDIDDocumentFromPublicKey(B.publicKey));
    signedObjectA = await openpgpSignJson(
      testObject,
      ADoc.publicKey[0].id,
      A.privateKey,
      passphrase,
    );
    signedObjectB = await openpgpSignJson(
      testObject,
      BDoc.publicKey[0].id,
      B.privateKey,
      passphrase,
    );
  });

  describe('openpgpSignJson', async () => {
    it('signs a json object and appends a signature property', async () => {
      expect(signedObjectA.signature).toBeDefined();
      expect(signedObjectB.signature).toBeDefined();
    });

    it('signature type matches package.json openpgp version', async () => {
      expect(signedObjectA.signature.type).toEqual(openpgpVersion);
      expect(signedObjectB.signature.type).toEqual(openpgpVersion);
    });
  });

  describe('openpgpVerifyJson', async () => {
    it('verifies the signature matches a public key and the document matches the signature', async () => {
      const message = base64url.decode(signedObjectA.signature.signatureValue);
      expect(await getMessagePayload(message)).toEqual(JSON.stringify(testObject));
      const valid = await openpgpVerifyJson(signedObjectA, A.publicKey);
      expect(valid).toBe(true);
    });

    it('errors if object is tampered with', async () => {
      signedObjectA.foo = '123';
      expect(openpgpVerifyJson(signedObjectA, A.publicKey)).rejects.toEqual(
        new Error('Object signature does not match object'),
      );
    });
  });
});
