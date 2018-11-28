const jsonSchemas = require('../../index');

const validator = new jsonSchemas.SchemaValidator();

const examples = require('./did.examples.json');

const schema = jsonSchemas.schemas.didSchema;

describe('json-schemas', () => {
  describe('schemas', () => {
    describe('didSchema', () => {
      it('is defined', () => {
        expect(schema).toBeDefined();
      });
      it('is self describing', () => {
        expect(validator.isValid(schema, jsonSchemas.schemas.selfDescSchema)).toBe(true);
      });
      it('supports uPort DIDs', () => {
        expect(validator.isValid(examples.uport, schema)).toBe(true);
      });
      it('supports nested DIDs', () => {
        expect(validator.isValid(examples.nested, schema)).toBe(true);
      });
    });
  });
});
