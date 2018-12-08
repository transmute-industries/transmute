const path = require('path');
const { values } = require('lodash');

const schemas = require('./schemas');

const SchemaValidator = require('./SchemaValidator');
const writeSchema = require('./writeSchema');

const ignoreSchemas = [
  'http://json-schema.org/draft-04/schema#',
  'https://docs.transmute.industries/schemas/com.transmute.self-desc/schema/jsonschema/1-0-0#',
];
const publishSchemas = () => {
  const schemaBase = path.resolve(__dirname, '../../../../docs/schemas');

  values(schemas).forEach((s) => {
    if (ignoreSchemas.indexOf(s.id || s.$id) === -1) {
      //   eslint-disable-next-line
      writeSchema(schemaBase, s);
    }
  });
};

module.exports = {
  schemas,
  SchemaValidator,
  publishSchemas,
};
