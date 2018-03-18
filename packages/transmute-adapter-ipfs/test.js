const adapter = require('./index');

const transmuteConfig = require('./transmute-config.json')

const tests = async () => {
  const db = adapter.getStorage(transmuteConfig.minikube.ipfs.config);
  
  let data1 = await adapter.setItem(db, { hello: 'world' });
  let data2 = await adapter.getItem(
    db,
    'QmNsrSKdN13Q6VHiggU5aANg1GHapQJEBVzpHF22tJj8Ew'
  );
  console.log(data1, data2);
};

tests();
