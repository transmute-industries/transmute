const { publishSchemas } = require('../index');
const writeSchema = require('../writeSchema');

jest.mock('../writeSchema');

describe('index', () => {
  beforeEach(() => {
    writeSchema.mockReset();
  });

  it('publishSchemas', async () => {
    expect(publishSchemas).toBeDefined();
    await publishSchemas();
    expect(writeSchema).toHaveBeenCalled();
  });
});
