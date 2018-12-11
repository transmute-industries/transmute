const schemas = require('./schemas');

const SchemaValidator = require('./SchemaValidator');

const validator = new SchemaValidator();

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
};
