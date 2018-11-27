const https = require('https');

const { Validator } = require('jsonschema');

const validator = new Validator();

const getData = url => new Promise((resolve, reject) => {
  https
    .get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        resolve(JSON.parse(data));
      });
    })
    .on('error', (err) => {
      reject(err);
    });
});

describe('self-describing-jsonschema', () => {
  it('com.transmute.self-desc', async () => {
    const rootSchema = await getData('https://json-schema.org/draft-04/schema');
    validator.addSchema(rootSchema, rootSchema.id);
    const schema = await getData(
      'https://docs.transmute.industries/schemas/com.transmute.self-desc/schema/jsonschema/1-0-0#',
    );
    const instance = await getData(
      'https://docs.transmute.industries/schemas/com.transmute.self-desc/instance/jsonschema/1-0-0#',
    );
    validator.addSchema(schema, schema.id);
    const result = validator.validate(instance, schema);
    const isValid = result.errors.length === 0;
    expect(isValid).toBe(true);
  });
});
