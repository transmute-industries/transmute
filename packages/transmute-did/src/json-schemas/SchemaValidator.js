const { Validator } = require('jsonschema');

const { values } = require('lodash');

const schemas = require('./schemas');

// Reference: https://github.com/0xProject/0x-monorepo/blob/development/packages/json-schemas/src/schema_validator.ts

class SchemaValidator {
  /**
   * Instantiates a SchemaValidator instance
   */
  constructor() {
    //   eslint-disable-next-line
    this._validator = new Validator();
    values(schemas).forEach((s) => {
      //   eslint-disable-next-line
      this._validator.addSchema(s, s.id);
    });
  }

  /**
   * Add a schema to the validator. All schemas and sub-schemas must be added to
   * the validator before the `validate` and `isValid` methods can be called with
   * instances of that schema.
   * @param s The schema to add
   */
  addSchema(s) {
    //   eslint-disable-next-line
    this._validator.addSchema(s, s.id);
  }

  /**
   * Validate the JS object conforms to a specific JSON schema
   * @param instance JS object in question
   * @param s Schema to check against
   * @returns The results of the validation
   */
  validate(instance, s) {
    const jsonSchemaCompatibleObject = JSON.parse(JSON.stringify(instance));
    //   eslint-disable-next-line
    return this._validator.validate(jsonSchemaCompatibleObject, s);
  }

  /**
   * Check whether an instance properly adheres to a JSON schema
   * @param instance JS object in question
   * @param s Schema to check against
   * @returns Whether or not the instance adheres to the schema
   */
  isValid(instance, s) {
    const result = this.validate(instance, s);
    if (result.errors.length) {
      console.log(result);
    }

    const isValid = result.errors.length === 0;
    return isValid;
  }
}

module.exports = SchemaValidator;
