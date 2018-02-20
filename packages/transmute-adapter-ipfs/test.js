const adapter = require('./index');

const tests = async () => {
  const db = adapter.getStorage({
    host: 'localhost',
    port: 5001,
    protocol: 'http'
  });
  let data1 = await adapter.setItem(db, { hello: 'world' });
  let data2 = await adapter.getItem(
    db,
    'QmNsrSKdN13Q6VHiggU5aANg1GHapQJEBVzpHF22tJj8Ew'
  );
  console.log(data1, data2);
};

tests();
