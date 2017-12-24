const adapter = require("./index");

const tests = async () => {
  let db = adapter.getStorage();
  let data1 = await adapter.setItem(db, { hello: "world" });
  let data2 = await adapter.getItem(
    db,
    "93a23971a914e5eacbf0a8d25154cda309c3c1c72fbb9914d47c60f3cb681588"
  );
  console.log(data1, data2);
};

tests();
