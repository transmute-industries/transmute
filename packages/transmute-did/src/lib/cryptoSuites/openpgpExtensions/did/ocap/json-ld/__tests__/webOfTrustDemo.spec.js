// Adapted from:
// https://github.com/WebOfTrustInfo/rebooting-the-web-of-trust-fall2017/blob/master/final-documents/lds-ocap.md

const base64url = require('base64url');

const { openpgpSignJson, openpgpVerifyJson } = require('../index');
const { createDIDDocumentFromPublicKey } = require('../../../../did');
const cryptoHelpers = require('../../../../cryptoHelpers');

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

// Cloud Storage
const C = {
  publicKey:
    '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW92VFBMFK4EEAAoCAwTmgduU/8/hxafy+DXuF9iuX5i/Aw+KI/DhgUpM\nyQ/ii2c9oUlQifk89dCA8N3LWSFvdgxuzpG8PoxPPMyiX66wzQNib2LCdwQQ\nEwgAKQUCW92VFAYLCQcIAwIJENI4TMzqADBQBBUICgIDFgIBAhkBAhsDAh4B\nAACv8QEA0LeBkl/w+pYXLcw1bfUeyxnt9ks4wQhMUD/odQjcZlYBAKPDnPDT\nl/Z8kojuzv9G1ct11h3f5ECddtZdY1EGY6TszlMEW92VFBIFK4EEAAoCAwTZ\nArqygJobYZG93VWv31dBxprcR/86IhJ3NRlIXZ4lsVRmufCBAFnGjWvZ8QzZ\nxY11P1xY9/BgTj8qXJWck9REAwEIB8JhBBgTCAATBQJb3ZUUCRDSOEzM6gAw\nUAIbDAAA6GQBAJweFcpt3+lnRlaPFR3wnfx+pjiY2miXkBDXnNI9aA/MAQDi\nBdA3f1Uq4PUZ3TOSGfPHGFrUGkNMpZG1uS7LHqHAqQ==\r\n=qBEC\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n',
  privateKey:
    '-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxaIEW92VFBMFK4EEAAoCAwTmgduU/8/hxafy+DXuF9iuX5i/Aw+KI/DhgUpM\nyQ/ii2c9oUlQifk89dCA8N3LWSFvdgxuzpG8PoxPPMyiX66w/gkDCCDkGbuQ\n1RuoYBIorWuQ5EYPOpuo5vDxHbQIllyzxX5ex9jIP5JnDGRlHG3Yij62X6Zv\niNe0ECdhCLPWGBOEGxjttfBp0KXQLsCgnS9IrYPNA2JvYsJ3BBATCAApBQJb\n3ZUUBgsJBwgDAgkQ0jhMzOoAMFAEFQgKAgMWAgECGQECGwMCHgEAAK/xAQDQ\nt4GSX/D6lhctzDVt9R7LGe32SzjBCExQP+h1CNxmVgEAo8Oc8NOX9nySiO7O\n/0bVy3XWHd/kQJ121l1jUQZjpOzHpgRb3ZUUEgUrgQQACgIDBNkCurKAmhth\nkb3dVa/fV0HGmtxH/zoiEnc1GUhdniWxVGa58IEAWcaNa9nxDNnFjXU/XFj3\n8GBOPypclZyT1EQDAQgH/gkDCLt2KY9DYhNcYKmCxPgl7uzqYlABeSVw4CyS\nqV8GJ5I97FhiypnVufyur0rmobTwlTUVsw7mfU37tCr/6zgbhi1JH0xDs877\nV23t1DdIEYPCYQQYEwgAEwUCW92VFAkQ0jhMzOoAMFACGwwAAOhkAQCcHhXK\nbd/pZ0ZWjxUd8J38fqY4mNpol5AQ15zSPWgPzAEA4gXQN39VKuD1Gd0zkhnz\nxxha1BpDTKWRtbkuyx6hwKk=\r\n=2jBD\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n',
};

// Dummy Bot
const D = {
  publicKey:
    '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW92VXhMFK4EEAAoCAwQ8cSJZu2dsBGbgzIZGoZVhJVdi3SNus7Cc1KX+\nEuHYc5y+nJP7sA1JBTjzqLfehj/BlJpo0DMTvnlEnDlH+z48zQNib2LCdwQQ\nEwgAKQUCW92VXgYLCQcIAwIJEErku6HhMezXBBUICgIDFgIBAhkBAhsDAh4B\nAADK1gEAntw3HL8os9kot8BR3OdKH59nCfdkNV67DWs0RWA39r8BAPQUXbuq\n3p7zep/LyUa0kVTElpn4lIocsyetpPQsRzFizlMEW92VXhIFK4EEAAoCAwR7\ncc3OLdHmlztePmthrsALz/FzXL4qaq9XNA+KfFGxT+WXzrkwtvyn0PcwTto8\nmmtRzZxmowhw6njwZhml/wplAwEIB8JhBBgTCAATBQJb3ZVeCRBK5Luh4THs\n1wIbDAAAW18A+gIkSdkZhfocLgf7rBn9gtXNyTFaCqpDdU8+gmbJGkc8AQCG\ngP0NSylshme10CqTyPdnCSaLc8xTdKWI7jcUHvbleQ==\r\n=d2gf\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n',
  privateKey:
    '-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxaIEW92VXhMFK4EEAAoCAwQ8cSJZu2dsBGbgzIZGoZVhJVdi3SNus7Cc1KX+\nEuHYc5y+nJP7sA1JBTjzqLfehj/BlJpo0DMTvnlEnDlH+z48/gkDCI/2Ppnm\nyhb7YCcb86dwUJZ+j43Z74DDqMebalv/aP6ArT8WXFwhNf73UUBUm3VicakG\nq4+AKini7bdlSH3gYFSB5i7VXPa8N9D5lG7FqsvNA2JvYsJ3BBATCAApBQJb\n3ZVeBgsJBwgDAgkQSuS7oeEx7NcEFQgKAgMWAgECGQECGwMCHgEAAMrWAQCe\n3Dccvyiz2Si3wFHc50ofn2cJ92Q1XrsNazRFYDf2vwEA9BRdu6renvN6n8vJ\nRrSRVMSWmfiUihyzJ62k9CxHMWLHpgRb3ZVeEgUrgQQACgIDBHtxzc4t0eaX\nO14+a2GuwAvP8XNcvipqr1c0D4p8UbFP5ZfOuTC2/KfQ9zBO2jyaa1HNnGaj\nCHDqePBmGaX/CmUDAQgH/gkDCLqiIDq2tiApYDo1A1Gbzj5Ieg/WdWC72GkP\nz4TUfNLEdcWIszn7YC/QEoQUI+wkijTSd3ch7yOy3GLKEgoyv9SZwlvhyw8W\na82+c5XnKojCYQQYEwgAEwUCW92VXgkQSuS7oeEx7NcCGwwAAFtfAPoCJEnZ\nGYX6HC4H+6wZ/YLVzckxWgqqQ3VPPoJmyRpHPAEAhoD9DUspbIZntdAqk8j3\nZwkmi3PMU3SliO43FB725Xk=\r\n=cwWr\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n',
};

const passphrase = 'yolo';

describe('did openpgp webOfTrustDemo', () => {
  let ADoc;
  let BDoc;
  let CDoc;
  let DDoc;
  let CtoACap;
  let AtoBCapWithCavs;
  let BtoDCapWithCavs;
  let DInvocOfC;

  let secureMessageForC;
  let plainText;

  beforeAll(async () => {
    ADoc = JSON.parse(await createDIDDocumentFromPublicKey(A.publicKey));
    BDoc = JSON.parse(await createDIDDocumentFromPublicKey(B.publicKey));
    CDoc = JSON.parse(await createDIDDocumentFromPublicKey(C.publicKey));
    DDoc = JSON.parse(await createDIDDocumentFromPublicKey(D.publicKey));
  });

  it('can create an object capability for a DID Doc?', async () => {
    const objCap = {
      '@context': [
        'https://example.org/did/v1',
        'https://example.org/ocap/v1',
        'http://schema.org',
      ],
      // technically, this document is owned by C at this point (it is signed by C below)
      // probably want to fix this id, so that chains are easier to understand
      id: 'did:example:0b36c7844941b61b-c763-4617-94de-cf5c539041f1',
      type: 'Proclamation',

      // The subject is who the capability operates on (in this case,
      // the Cloud Store object)
      subject: CDoc.id,

      // We are granting access specifically to one of Alice's keys
      grantedKey: ADoc.publicKey[0].id,

      // No caveats on this capability... Alice has full access
      caveat: [],

      // Finally we sign this object with one of the CloudStorage's keys
      // this is done below
      //   signature: {
      //     type: "RsaSignature2016",
      //     created: "2016-02-08T16:02:20Z",
      //     creator: "did:example:0b36c784-f9f4-4c1e-b76c-d821a4b32741#key-1",
      //     signatureValue: "IOmA4R7TfhkYTYW8...CBMq2/gi25s="
      //   }
    };
    CtoACap = await openpgpSignJson(objCap, CDoc.publicKey[0].id, C.privateKey, passphrase);
    expect(CtoACap).toBeDefined();
  });

  it('can verify a gpg object capability is signed correctly?', async () => {
    // Alice access to C was signed by C...
    const verified = await openpgpVerifyJson(CtoACap, C.publicKey);
    expect(verified).toBe(true);
  });

  it('can A delegate her full access to C to B with caveats?', async () => {
    const objCap = {
      '@context': [
        'https://example.org/did/v1',
        'https://example.org/ocap/v1',
        'http://schema.org',
      ],
      id: 'did:example:f7412b9a-854b-47ab-806b-3ac736cc7cda',
      type: 'Proclamation',

      // This new attenuated proclamation points to the previous one
      parent: CtoACap.id,

      // Now we grant access to one of Bob's keys
      grantedKey: BDoc.publicKey[0].id,

      // This proclamation *does* have caveats:
      caveat: [
        // Only the UploadFile method is allowed...
        {
          id: 'did:example:f7412b9a-854b-47ab-806b-3ac736cc7cda#caveats/upload-only',
          type: 'RestrictToMethod',
          method: 'UploadFile',
        },
        // ...and each upload can only be 50 Megabytes large.
        {
          id: 'did:example:f7412b9a-854b-47ab-806b-3ac736cc7cda#caveats/50-megs-only',
          type: 'RestrictUploadSize',
          // file limit here is in bytes, so 50 MB
          limit: 52428800,
        },
      ],

      // Finally we sign this object with Alice's key
      // this is added below (by Alice, not C!)
      //   signature: {
      //     type: "RsaSignature2016",
      //     created: "2016-02-08T16:02:20Z",
      //     creator: "did:example:83f75926-51ba-4472-84ff-51f5e39ab9ab#key-1",
      //     signatureValue: "..."
      //   }
    };

    AtoBCapWithCavs = await openpgpSignJson(objCap, ADoc.publicKey[0].id, A.privateKey, passphrase);
    expect(AtoBCapWithCavs).toBeDefined();
  });

  it('can B delegate his partial access to C to D with caveats?', async () => {
    const objCap = {
      '@context': [
        'https://example.org/did/v1',
        'https://example.org/ocap/v1',
        'http://schema.org',
      ],
      id: 'did:example:d2c83c43-878a-4c01-984f-b2f57932ce5f',
      type: 'Proclamation',

      // Yet again, point up the chain...
      parent: AtoBCapWithCavs.id,

      // Now we grant access to one of Dummy Bot's keys
      grantedKey: DDoc.publicKey[0].id,

      // We add a new caveat/attenuation: this one will expire 30 days
      // in the future
      caveat: [
        {
          id: 'did:example:d2c83c43-878a-4c01-984f-b2f57932ce5f#caveats/expire-time',
          type: 'ExpireTime',
          date: '2017-09-23T20:21:34Z',
        },
      ],

      // Finally we sign this object with Bob's key
      //   This will be done by bob below
      //   signature: {
      //     type: "RsaSignature2016",
      //     created: "2016-02-08T17:12:28Z",
      //     creator: "did:example:ee568de7-2970-4925-ad09-c685ab367b66#key-1",
      //     signatureValue: "..."
      //   }
    };
    BtoDCapWithCavs = await openpgpSignJson(objCap, BDoc.publicKey[0].id, B.privateKey, passphrase);
    expect(BtoDCapWithCavs).toBeDefined();
  });

  it('can D use cap chain to upload to C?', async () => {
    const objCap = {
      '@context': [
        'https://example.org/did/v1',
        'https://example.org/ocap/v1',
        'http://schema.org',
      ],
      id: 'did:example:2bdf6273-a52e-4cdf-991f-b5f000008829',
      type: 'Invocation',

      // Dummy Bot is invoking the proclamation it has,
      // but the whole chain will be checked for attenuation and
      // verification of access
      proclamation: BtoDCapWithCavs.id,

      // The method being used
      method: 'UploadFile',

      // The key Dummy Bot is using in this invocation
      usingKey: DDoc.publicKey[0].id,

      // Here's the base64 encoded file as part of the payload
      file: base64url('some plaintext from D'),

      // Finally we sign this object with Dummy Bot's key
      //   Signed by D below
      //   signature: {
      //     type: "RsaSignature2016",
      //     created: "2016-02-08T17:13:48Z",
      //     creator: "did:example:5e0fe086-3dd7-4b9b-a25f-023a567951a4#key-1",
      //     signatureValue: "..."
      //   }
    };

    DInvocOfC = await openpgpSignJson(objCap, DDoc.publicKey[0].id, D.privateKey, passphrase);
    expect(DInvocOfC).toBeDefined();
  });

  it('can D send encrypted Invocation to C?', async () => {
    secureMessageForC = await cryptoHelpers.encryptMessage({
      message: JSON.stringify(DInvocOfC),
      privateKey: D.privateKey,
      publicKey: C.publicKey,
      passphrase,
    });
  });

  it('can C decrypt Invocation from D?', async () => {
    plainText = await cryptoHelpers.decryptMessage({
      message: secureMessageForC,
      privateKey: C.privateKey,
      publicKey: D.publicKey,
      passphrase,
    });
    expect(plainText).toEqual(JSON.stringify(DInvocOfC));
  });
});
