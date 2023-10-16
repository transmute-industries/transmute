
import scitt from '../src/api/scitt'

it("sql ledger crud", async () => {
  const log = await scitt.ledgers.sqlite("./db.sqlite").create();
  const leaf1 = 'deadbeef'
  const leaf2 = 'beef'
  await log.append(leaf1)
  await log.append(leaf2)
  const record1 = await log.getByIndex(1)
  const record2 = await log.getByValue(leaf2)
  expect(record1).toEqual({
    id: 1,
    leaf: leaf1
  })
  expect(record2).toEqual({
    id: 2,
    leaf: leaf2
  })
});

describe('incremental read', () => {
  it("read something that does not exist write", async () => {
    const log = await scitt.ledgers.sqlite("./db.sqlite").create();
    const leaf1 = 'deadbeef22222'
    const record2 = await log.getByValue(leaf1)
    expect(record2).toEqual(undefined)
  });
  it("read after write", async () => {
    const log = await scitt.ledgers.sqlite("./db.sqlite").create();
    const leaf1 = 'deadbeef'
    const record2 = await log.getByValue(leaf1)
    expect(record2).toEqual({
      id: 1,
      leaf: leaf1
    })
  });
  it("read all leaves", async () => {
    const log = await scitt.ledgers.sqlite("./db.sqlite").create();
    const entries = await log.allLogEntries()
    expect(entries.length).toBe(2)
    const leaves = await log.allLeaves()
    expect(leaves.length).toBe(2)
  });
})
