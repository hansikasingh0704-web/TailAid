import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  console.warn('[v0] MONGODB_URI not set - using localStorage fallback')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri!, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri!, options)
    clientPromise = client.connect()
  }
} else {
  clientPromise = Promise.reject(new Error('MongoDB not configured'))
}

export default clientPromise
