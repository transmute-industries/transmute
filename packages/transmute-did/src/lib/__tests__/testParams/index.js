const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const {
  TransmuteDIDWallet,
  constructDIDPublicKeyID,
  // createWallet,
  // openpgpExtensions,
} = require('../../../index');
// const pack = require('../../../../package.json');

const actors = ['A', 'B', 'C', 'D'];

// const createActorWallet = async (actor) => {
//   const wallet = await createWallet();
//   let keypair = await openpgpExtensions.cryptoHelpers.generateArmoredKeypair({
//     name: actor,
//     passphrase: actor,
//   });
//   await wallet.addKey(keypair, 'assymetric', {
//     version: `openpgp@${pack.dependencies.openpgp}`,
//     tags: ['OpenPGP.js', 'macbook pro'],
//     notes: 'created for testing purposes',
//     did: {
//       publicKey: true,
//       authentication: true,
//       publicKeyType: 'publicKeyPem',
//       signatureType: 'Secp256k1VerificationKey2018',
//     },
//   });
//   keypair = await openpgpExtensions.cryptoHelpers.generateArmoredKeypair({
//     name: actor,
//     passphrase: actor,
//   });
//   await wallet.addKey(keypair, 'assymetric', {
//     version: `openpgp@${pack.dependencies.openpgp}`,
//     tags: ['OpenPGP.js', 'macbook pro'],
//     notes: 'created for testing purposes',
//     did: {
//       publicKey: true,
//       authentication: true,
//       publicKeyType: 'publicKeyPem',
//       signatureType: 'Secp256k1VerificationKey2018',
//     },
//   });
//   fs.writeFileSync(
//     path.resolve(__dirname, `${actor}Wallet.json`),
//     JSON.stringify(wallet.data, null, 2),
//   );
// };

const generateActors = async () => Promise.all(
  _.map(actors, async (actor) => {
    // createActorWallet(actor);
    const walletJson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, `${actor}Wallet.json`)),
    );
    const wallet = new TransmuteDIDWallet(walletJson);
    const firstKey = Object.keys(walletJson.keystore)[0];
    const secondKey = Object.keys(walletJson.keystore)[1];
    const did = `did:test:${actor}`;
    const proofSet = [
      { kid: constructDIDPublicKeyID(did, firstKey), password: actor },
      { kid: constructDIDPublicKeyID(did, secondKey), password: actor },
    ];
    const { data } = await wallet.toDIDDocument({
      did,
      proofSet,
    });
    return {
      wallet,
      didDocument: data,
      proofSet,
    };
  }),
);

module.exports = async () => {
  const actorData = await generateActors();
  const index = {};
  _.each(actorData, (data) => {
    index[data.didDocument.id] = {
      wallet: data.wallet,
      didDocument: data.didDocument,
      proofSet: data.proofSet,
    };
  });
  return index;
};
