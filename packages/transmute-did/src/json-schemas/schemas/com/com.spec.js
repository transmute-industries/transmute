const jsonSchemas = require('../../index');

const validator = new jsonSchemas.SchemaValidator();

describe('json-schemas', () => {
  describe('schemas', () => {
    describe('schema', () => {
      it('is defined', () => {
        expect(jsonSchemas.schemas.schema).toBeDefined();
      });

      it('is self describing', () => {
        expect(validator.isValid(jsonSchemas.schemas.schema, jsonSchemas.schemas.schema)).toBe(
          true,
        );
      });
    });

    describe('selfDescSchema', () => {
      it('is defined', () => {
        expect(jsonSchemas.schemas.selfDescSchema).toBeDefined();
      });

      it('is self describing', () => {
        expect(
          validator.isValid(jsonSchemas.schemas.selfDescSchema, jsonSchemas.schemas.selfDescSchema),
        ).toBe(true);
      });
    });
  });
});
