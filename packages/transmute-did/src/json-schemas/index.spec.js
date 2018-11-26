const jsonSchemas = require('./index');

describe('json-schemas', () => {
  describe('schemas', () => {
    it('is defined', () => {
      expect(jsonSchemas.schemas).toBeDefined();
    });
  });
});
