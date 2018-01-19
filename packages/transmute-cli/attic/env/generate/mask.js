const fs = require("fs");

module.exports = (args, callback) => {
  let { dotenv, output } = args;
  // console.log( args )
  fs.readFile(dotenv, "utf8", (err, envFile) => {
    if (err) {
      throw err;
    }
    let lines = envFile.split("\n");
    let result = "";
    lines.forEach(line => {
      if (line) {
        let [key, value] = line.split("=");
        result += `${key}='______________________' \n`;
      }
    });
    fs.writeFile(output, result, err => {
      if (err) return console.log(err);
      callback();
    });
  });
};
