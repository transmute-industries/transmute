const fs = require('fs-extra');
const path = require('path');

const writeSchema = (baseDir, selfDescJsonSchema) => {
  fs.outputFileSync(
    path.resolve(
      baseDir,
      `${selfDescJsonSchema.self.vendor}/${selfDescJsonSchema.self.name}/${
        selfDescJsonSchema.self.format
      }/${selfDescJsonSchema.self.version}`,
    ),
    JSON.stringify(selfDescJsonSchema, null, 2),
  );
  return true;
};
module.exports = writeSchema;
