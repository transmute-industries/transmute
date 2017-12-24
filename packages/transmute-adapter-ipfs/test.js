const adapter = require("./index");

let db = adapter.getStorage();

const tests = async () => {
  let db = adapter.getStorage();
  let data1 = await adapter.setItem(db, { hello: "world" });
  let data2 = await adapter.getItem(db, "QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen");
  console.log(data1, data2);
};

tests();
