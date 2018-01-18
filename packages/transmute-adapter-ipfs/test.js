const adapter = require("./index");

let db = adapter.getStorage();

const tests = async () => {
  let db = adapter.getStorage();
  let data1 = await adapter.setItem(db, { hello: "world" });
  let data2 = await adapter.getItem(db, "Qme7DMBUe1EjXAKoEXzNh7G7NgMeGw9i2uLfB9bKVR7hHZ");
  console.log(data1, data2);
};

tests();
