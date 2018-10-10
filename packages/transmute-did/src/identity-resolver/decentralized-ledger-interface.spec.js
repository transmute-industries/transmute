const dli = require('./decentralized-ledger-interface');
const { misc, msg, pgp } = require('../index.js');

// Helper function
const generateDID = async () => {
    // Generate keys
    const pgpKeypair = await pgp.generateOpenPGPArmoredKeypair({
        name: "bob",
        passphrase: "yolo"
    });
    const libSodiumSigningKeypair = await msg.generateCryptoSignKeypair();
    const libSodiumEncryptionKeypair = await msg.generateCryptoBoxKeypair();
    const primaryPublicKey = libSodiumSigningKeypair.publicKey;
    // Generate DID
    const did = misc.publicKeyToTransmuteDID({publicKey: primaryPublicKey});
    // Generate DID document
    const didDocumentArgs = {
        primaryPublicKey,
        pgpPublicKey: pgpKeypair.publicKey,
        libSodiumPublicSigningKey: libSodiumSigningKeypair.publicKey,
        libSodiumPublicEncryptionKey: libSodiumEncryptionKeypair.publicKey
    };
    const didDocument = await misc.publicKeysToDIDDocument(didDocumentArgs);

    return {did, didDocument};
}

let did1, didDocument1;
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
