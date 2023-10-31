import fs from 'fs'
import path from 'path'

export type LeafIndex = number;
export type LeafValue = string // a verifiable data structure specific hash of signed statement

export type LogEntry = {
  id: LeafIndex
  leaf: LeafValue;
}

export type ScittJsonFileDB = {
  name: string
  version: string
  leaves: string[]
}

const transparency_log = (pathToDb: string) => {

  const logInterface = {
    create: async () => {
      try {
        const dbFile = fs.readFileSync(path.resolve(process.cwd(), pathToDb)).toString();
        const db = JSON.parse(dbFile);
        // todo healtcheck
        return logInterface
      } catch (e) {
        const db = {
          name: 'scitt-ledger',
          version: '0.0.0',
          leaves: []
        }
        fs.writeFileSync(path.resolve(process.cwd(), pathToDb), JSON.stringify(db, null, 2))
        return logInterface
      }

    },
    append: async (leaf: LeafValue): Promise<LogEntry> => {
      const dbFile = fs.readFileSync(path.resolve(process.cwd(), pathToDb)).toString();
      const db = JSON.parse(dbFile)
      db.leaves.push(leaf)
      const record = { id: db.leaves.length - 1, leaf }
      fs.writeFileSync(path.resolve(process.cwd(), pathToDb), JSON.stringify(db, null, 2))
      return record as LogEntry
    },
    getByIndex: async (index: LeafIndex): Promise<LogEntry | undefined> => {
      const dbFile = fs.readFileSync(path.resolve(process.cwd(), pathToDb)).toString();
      const db = JSON.parse(dbFile)
      const record = db.leaves[index]
      return record as LogEntry
    },
    getByValue: async (leaf: LeafValue): Promise<LogEntry | undefined> => {
      const dbFile = fs.readFileSync(path.resolve(process.cwd(), pathToDb)).toString();
      const db = JSON.parse(dbFile)
      const record = db.leaves.find((leafValue) => {
        return leafValue === leaf
      })
      return record as LogEntry
    },
    allLogEntries: async (): Promise<Array<LogEntry>> => {
      const dbFile = fs.readFileSync(path.resolve(process.cwd(), pathToDb)).toString();
      const db = JSON.parse(dbFile)
      const records = db.leaves.map((v, i) => {
        return {
          id: i,
          leaf: v
        }
      })
      return records as LogEntry[]
    },
    allLeaves: async (): Promise<Array<LeafValue>> => {
      const dbFile = fs.readFileSync(path.resolve(process.cwd(), pathToDb)).toString();
      const db = JSON.parse(dbFile)
      return db.leaves as LeafValue[]
    }
  }
  return logInterface
}

export default transparency_log