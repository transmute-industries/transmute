const path = require('path');
const fs = require('fs');

const fullWalletPath = path.resolve(__dirname, './wallet.plaintext.full.json');
const didDocumentPath = path.resolve(__dirname, './didDocument.proofSet.json');
const proofSetPath = path.resolve(__dirname, './signedLinkedData.proofSet.json');
const proofChainPath = path.resolve(__dirname, './signedLinkedData.proofChain.json');

const ethereumKID = '911a23e0029a183ae4399017cc7f6f3d7535e5b651b563e283b71a4d9ca3763a';
const openPGPKID = '2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178';
const libsodiumKID = 'c541a06014170f7e85383f13e95f2bf45da28473daa241fc2f21b16461efdec2';
const orbitDBKID = '5c51560bcef78d176b726a00b27ad3ef533ae39ef3d0f514392c79988c40d220';

const passphrase = 'yolo';
const did = 'did:test:0x123';

const fullWallet = JSON.parse(fs.readFileSync(fullWalletPath).toString());

module.exports = {
  fullWallet,
  fullWalletPath,
  didDocumentPath,
  proofSetPath,
  proofChainPath,
  ethereumKID,
  openPGPKID,
  libsodiumKID,
  orbitDBKID,
  passphrase,
  did,
};
