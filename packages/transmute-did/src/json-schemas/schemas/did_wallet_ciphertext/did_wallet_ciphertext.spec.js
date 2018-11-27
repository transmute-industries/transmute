const jsonSchemas = require('../../index');

const validator = new jsonSchemas.SchemaValidator();

const examples = require('./examples');

const schema = jsonSchemas.schemas.didWalletCiphertextSchema;

describe('json-schemas', () => {
  describe('schemas', () => {
    describe('didWalletCiphertextSchema', () => {
      it('is defined', () => {
        expect(schema).toBeDefined();
      });

      it('is self describing', () => {
        expect(validator.isValid(schema, jsonSchemas.schemas.selfDescSchema)).toBe(true);
      });

      it('supports transmute nested', () => {
        expect(validator.isValid(examples.transmuteNested, schema)).toBe(true);
      });
    });
  });
});
