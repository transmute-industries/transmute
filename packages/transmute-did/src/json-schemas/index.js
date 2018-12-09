const path = require('path');
const { values } = require('lodash');

const schemas = require('./schemas');

const SchemaValidator = require('./SchemaValidator');

const validator = new SchemaValidator();
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

const schemaToURI = (selfDescJsonSchema) => {
  const baseURI = 'https://docs.transmute.industries/schemas';
  return `${baseURI}/${selfDescJsonSchema.self.vendor}/${selfDescJsonSchema.self.name}/${
    selfDescJsonSchema.self.format
  }/${selfDescJsonSchema.self.version}`;
};

module.exports = {
  schemas,
  schemaToURI,
  SchemaValidator,
  validator,
  publishSchemas,
};
