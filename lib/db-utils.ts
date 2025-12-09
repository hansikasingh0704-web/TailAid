import clientPromise from './mongodb'
import { ObjectId } from 'mongodb'

const dbName = 'tailaid'

const inMemoryDB: { [key: string]: any[] } = {
  users: [],
  alerts: [],
  rescue_centers: [],
  hospitals: [],
  notes: [],
}

export async function getDatabase() {
  try {
    const client = await clientPromise
    return client.db(dbName)
  } catch (error) {
    return null
  }
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase()
  if (db) {
    return db.collection(collectionName)
  }
  return createFallbackCollection(collectionName)
}

function createFallbackCollection(name: string) {
  return {
    async find(query: any = {}) {
      const items = inMemoryDB[name] || []
      const filtered = items.filter(item => {
        return Object.keys(query).every(key => item[key] === query[key])
      })
      return {
        sort: (field: any) => ({
          toArray: async () => filtered
        }),
        toArray: async () => filtered
      }
    },
    async findOne(query: any) {
      const items = inMemoryDB[name] || []
      return items.find(item => {
        return Object.keys(query).every(key => item[key] === query[key])
      })
    },
    async insertOne(doc: any) {
      if (!inMemoryDB[name]) inMemoryDB[name] = []
      const id = new ObjectId()
      inMemoryDB[name].push({ ...doc, _id: id })
      return { insertedId: id }
    },
    async updateOne(filter: any, update: any) {
      if (!inMemoryDB[name]) return { modifiedCount: 0 }
      const index = inMemoryDB[name].findIndex(item =>
        Object.keys(filter).every(key => item[key] === filter[key])
      )
      if (index > -1) {
        inMemoryDB[name][index] = { ...inMemoryDB[name][index], ...update.$set }
        return { modifiedCount: 1 }
      }
      return { modifiedCount: 0 }
    },
    async deleteOne(filter: any) {
      if (!inMemoryDB[name]) return { deletedCount: 0 }
      const index = inMemoryDB[name].findIndex(item =>
        Object.keys(filter).every(key => item[key] === filter[key])
      )
      if (index > -1) {
        inMemoryDB[name].splice(index, 1)
        return { deletedCount: 1 }
      }
      return { deletedCount: 0 }
    }
  }
}

export const collections = {
  users: 'users',
  alerts: 'alerts',
  rescueCenters: 'rescue_centers',
  hospitals: 'hospitals',
  notes: 'notes',
}
