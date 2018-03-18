const adapter = require('./index');
process.env.NODE_TLS_REJECT_UNAUTHORIZED=0
const tests = async () => {
  const db = adapter.getStorage({
    "host": "ipfs.transmute.minikube",
    "port": 32443,
    "protocol": "https"
  });
  let data1 = await adapter.setItem(db, { hello: 'world' });
  let data2 = await adapter.getItem(
    db,
    'QmNsrSKdN13Q6VHiggU5aANg1GHapQJEBVzpHF22tJj8Ew'
  );
  console.log(data1, data2);
};

tests();
