const jsonSchemas = require('../../index');

const validator = new jsonSchemas.SchemaValidator();

const examples = require('./examples');

const schema = jsonSchemas.schemas.didWalletSignatureSchema;

describe('json-schemas', () => {
  describe('schemas', () => {
    describe('didWalletSignatureSchema', () => {
      it('is defined', () => {
        expect(schema).toBeDefined();
      });

      it('supports transmute nested', () => {
        expect(validator.isValid(examples.transmuteNested, schema)).toBe(true);
      });
    });
  });
});
