const path = require('path');

const fs = require('fs');

const testKeypair0 = {
  publicKey:
    '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW5fxLhMFK4EEAAoCAwTYLueHwRJAX/JVmYBVscOPb7eYG/EwLvC5/7Ce\nHG5SlrIXclvf9Fh9GhV3nQd/D5vxWjSF4Ud+KYzHUKS8ZOaXzQNib2LCdwQQ\nEwgAKQUCW5fxLgYLCQcIAwIJEKoktMp6PshzBBUICgIDFgIBAhkBAhsDAh4B\nAABl+gD/ajcrBy5REJgqUSSncvaFHNJbFOgf4nd7emD9/U3aNSEBAIJwQh5J\np+FO1fz1Nz58hc5HS9XXswNmO79qUieA38ZdzlMEW5fxLhIFK4EEAAoCAwQ4\nukATZ1Ph5fjXJaly1OvYWedx9HTIHWJGsQYZ9YyqbR9iASmadeRSGLDBB38X\n9jX8dvupyVigMXi4XsbTG26AAwEIB8JhBBgTCAATBQJbl/EuCRCqJLTKej7I\ncwIbDAAA0HcBAKh+wK4C5LMAeVFMB8s5XM5UEyPK2fAa35rfxbq/n+1rAQDC\na6Nrpc7sAkhXxh4IdRmB3WKJkckJ4AiA7vu6L1UEgA==\r\n=HRUx\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n',
  privateKey:
    '-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxaIEW5fxLhMFK4EEAAoCAwTYLueHwRJAX/JVmYBVscOPb7eYG/EwLvC5/7Ce\nHG5SlrIXclvf9Fh9GhV3nQd/D5vxWjSF4Ud+KYzHUKS8ZOaX/gkDCCBZW03P\nze+KYFfpKHgr9XGe345lATcy0rr1yhlViz/Z/e1szPqqOX0XEEnHSz46lo6l\nrsxSn5K8sE838SM8rkM0bhgB6Vg0LEralBA2cUrNA2JvYsJ3BBATCAApBQJb\nl/EuBgsJBwgDAgkQqiS0yno+yHMEFQgKAgMWAgECGQECGwMCHgEAAGX6AP9q\nNysHLlEQmCpRJKdy9oUc0lsU6B/id3t6YP39Tdo1IQEAgnBCHkmn4U7V/PU3\nPnyFzkdL1dezA2Y7v2pSJ4Dfxl3HpgRbl/EuEgUrgQQACgIDBDi6QBNnU+Hl\n+NclqXLU69hZ53H0dMgdYkaxBhn1jKptH2IBKZp15FIYsMEHfxf2Nfx2+6nJ\nWKAxeLhextMbboADAQgH/gkDCD0NdSj74x0BYD2DxuSb1JfKwG3nzEoFzG4u\nuDOETmKcUYlNjsx6fH76wI9KH1GvhURzyEeVncs+xfPt2Bu6gZTrA1eHkoAF\nK4Au+zdVkdPCYQQYEwgAEwUCW5fxLgkQqiS0yno+yHMCGwwAANB3AQCofsCu\nAuSzAHlRTAfLOVzOVBMjytnwGt+a38W6v5/tawEAwmuja6XO7AJIV8YeCHUZ\ngd1iiZHJCeAIgO77ui9VBIA=\r\n=6N7L\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n',
};

const passphrase = 'yolo';

const {
  armoredKeytoDID,
  createDIDDocumentFromPublicKey,
  verifyDIDDocumentWasSignedByID,
} = require('../../did');

const { signDetached } = require('../../cryptoHelpers');

describe('openpgp did', () => {
  let testDID;
  let testDIDDocStr;
  let testDIDDoc;

  beforeAll(async () => {
    testDID = await armoredKeytoDID(testKeypair0.publicKey);
    testDIDDocStr = await createDIDDocumentFromPublicKey(testKeypair0.publicKey);
    testDIDDoc = JSON.parse(testDIDDocStr);
  });

  describe('armoredKeytoDID', async () => {
    it('creates a did with gpg fingerprint method', async () => {
      expect(testDID).toBeDefined();
    });
  });

  describe('createDIDDocumentFromPublicKey', async () => {
    it('creates a did document with gpg fingerprint method', async () => {
      expect(testDIDDoc.id).toBe(testDID);
    });
  });

  describe('verifyDIDDocumentWasSignedByID', async () => {
    it('should use a detached signature to verify a DID Document', async () => {
      const formattedDocStr = JSON.stringify(testDIDDoc, null, 2);
      const docPath = path.resolve(__dirname, './did_doc.json');
      const sigPath = path.resolve(__dirname, './did_doc.sig');

      fs.writeFileSync(docPath, formattedDocStr);

      const detachedSig = await signDetached(formattedDocStr, testKeypair0.privateKey, passphrase);
      fs.writeFileSync(sigPath, detachedSig);

      const valid = await verifyDIDDocumentWasSignedByID(docPath, sigPath);

      expect(valid).toBe(true);
    });
  });
});
