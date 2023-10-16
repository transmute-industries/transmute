
import { AsyncDatabase } from 'promised-sqlite3'

const scittLedgerTableName = `scitt_ledger`

export type LeafIndex = number;
export type LeafValue = string // a verifiable data structure specific hash of signed statement

export type LogEntry = {
  id: LeafIndex
  leaf: LeafValue;
}

const createTable = async (db: AsyncDatabase) => {
  await db.run(
    `CREATE TABLE IF NOT EXISTS ${scittLedgerTableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, leaf TEXT NOT NULL)`
  );
}

const entryByIndex = async (db: AsyncDatabase, index: LeafIndex) => {
  const statement = await db.prepare(`SELECT * FROM ${scittLedgerTableName} WHERE id = ?`, index);
  const row = await statement.get();
  await statement.finalize()
  return row as LogEntry | undefined
}

const entryByValue = async (db: AsyncDatabase, value: LeafValue) => {
  const statement = await db.prepare(`SELECT * FROM ${scittLedgerTableName} WHERE leaf = ?`, value);
  const row = await statement.get();
  await statement.finalize()
  return row as LogEntry | undefined
}

const readAllRows = async (db: AsyncDatabase) => {
  const rows = await db.all(`SELECT * FROM ${scittLedgerTableName}`);
  return rows as LogEntry[] || []
}

const readAllLeaves = async (db: AsyncDatabase) => {
  const rows = await db.all(`SELECT leaf FROM ${scittLedgerTableName}`);
  if (!rows) {
    return []
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (rows as unknown[]).map((r: any) => r.leaf) as LeafValue[] || []
}

const appendToLog = async (db: AsyncDatabase, value: LeafValue) => {
  const maybeRecord = await entryByValue(db, value)
  if (maybeRecord) {
    return maybeRecord
  }
  return db.run(`INSERT INTO ${scittLedgerTableName} (leaf) VALUES (?)`, value);
}

const ensureLeafText = (value: LeafValue) => {
  const valid = /[\da-f]/i.test(value)
  if (!valid) {
    throw new Error('leaf must be hexidecimal and lower case string.')
  }
}

const transparency_log = (pathToDb: string) => {
  let db;
  const logInterface = {
    db,
    create: async () => {
      db = await AsyncDatabase.open(pathToDb);
      try {
        await createTable(db)
      } catch (e) {
        //
      }
      return logInterface
    },
    append: async (leaf: LeafValue) => {
      ensureLeafText(leaf)
      await appendToLog(db, leaf)
      return logInterface
    },
    getByIndex: async (index: LeafIndex): Promise<LogEntry | undefined> => {
      return entryByIndex(db, index)
    },
    getByValue: async (leaf: LeafValue): Promise<LogEntry | undefined> => {
      ensureLeafText(leaf)
      return entryByValue(db, leaf)
    },
    allLogEntries: async (): Promise<Array<LogEntry>> => {
      return readAllRows(db)
    },
    allLeaves: async (): Promise<Array<LeafValue>> => {
      return readAllLeaves(db)
    },
    close: async (): Promise<void> => {
      await db.close()
    }
  }
  return logInterface
}

export default transparency_log