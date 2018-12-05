const { publishSchemas } = require('../index');

const fs = jest.genMockFromModule('fs');

describe('index', () => {
  it('publishSchemas', async () => {
    expect(publishSchemas).toBeDefined();
    await publishSchemas();
  });
});
