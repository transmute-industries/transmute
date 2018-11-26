const jsonSchemas = require('../../index');

const validator = new jsonSchemas.SchemaValidator();

const examples = require('./examples');

const schema = jsonSchemas.schemas.didDocumentSchema;

describe('json-schemas', () => {
  describe('schemas', () => {
    describe('didDocumentSchema', () => {
      it('is defined', () => {
        expect(schema).toBeDefined();
      });

      it('supports w3c', () => {
        expect(validator.isValid(examples.w3c, schema)).toBe(true);
      });

      it('supports transmute nested', () => {
        expect(validator.isValid(examples.transmuteNested, schema)).toBe(true);
      });

      it('supports uport', () => {
        expect(validator.isValid(examples.uport, schema)).toBe(true);
      });

      it('supports revoked transmute did document', () => {
        expect(validator.isValid(examples.transmuteRevoked.object, schema)).toBe(true);
      });
    });
  });
});
