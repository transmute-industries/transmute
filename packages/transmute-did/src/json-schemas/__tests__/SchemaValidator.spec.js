const SchemaValidator = require('../SchemaValidator');

const schema = require('../schemas/com/schema.json');

const instance = schema;

describe('SchemaValidator', () => {
  let v;

  beforeAll(() => {
    v = new SchemaValidator();
  });

  it('has a constructor', async () => {
    expect(v).toBeDefined();
  });

  describe('addSchema', () => {
    it('supports adding a file', async () => {
      v.addSchema(schema);
    });

    it('supports adding a uri', async () => {
      v.addSchema('https://json-schema.org/draft-04/schema');
    });
  });

  describe('validate', () => {
    it('supports validating an instance', async () => {
      const result = v.validate(instance, schema);
      expect(result.errors).toEqual([]);
    });
  });

  describe('isValid', () => {
    it('supports validating an instance', async () => {
      const isValid = v.isValid(instance, schema);
      expect(isValid).toBe(true);
    });
  });
});
