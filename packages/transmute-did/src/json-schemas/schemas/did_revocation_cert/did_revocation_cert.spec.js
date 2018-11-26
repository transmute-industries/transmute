const jsonSchemas = require('../../index');

const validator = new jsonSchemas.SchemaValidator();

const examples = require('../did_document/examples');

const schema = jsonSchemas.schemas.didRevocationCertSchema;

describe('json-schemas', () => {
  describe('schemas', () => {
    describe('didRevocationCertSchema', () => {
      it('supports revoked transmute did document', () => {
        expect(validator.isValid(examples.transmuteRevoked.object.revocationCert, schema)).toBe(
          true,
        );
      });
    });
  });
});
