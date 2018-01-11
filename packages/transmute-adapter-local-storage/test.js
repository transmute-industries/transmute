const adapter = require("./index");

const tests = async () => {
  let db = adapter.getStorage();
  let data1 = await adapter.setItem(db, { hello: "world" });
  let data2 = await adapter.getItem(
    db,
    "2248ee2fa0aaaad99178531f924bf00b"
  );
  console.log(data1, data2);
};

tests();
