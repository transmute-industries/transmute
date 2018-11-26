const jsonSchemas = require('../../index');

const validator = new jsonSchemas.SchemaValidator();

const examples = require('./did.examples.json');

describe('json-schemas', () => {
  describe('schemas', () => {
    describe('didSchema', () => {
      it('is defined', () => {
        expect(jsonSchemas.schemas.didSchema).toBeDefined();
      });
      it('supports uPort DIDs', () => {
        expect(validator.isValid(examples.uport, jsonSchemas.schemas.didSchema)).toBe(true);
      });
      it('supports nested DIDs', () => {
        expect(validator.isValid(examples.nested, jsonSchemas.schemas.didSchema)).toBe(true);
      });
    });
  });
});
