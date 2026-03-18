import { MongoClient, Db, Collection, Document } from "mongodb"
import { env } from "@/lib/env"

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient }

let client: MongoClient | null = globalForMongo._mongoClient ?? null

async function getClient(): Promise<MongoClient> {
  if (client) return client

  client = new MongoClient(env.MONGODB_URI)
  await client.connect()
  globalForMongo._mongoClient = client
  return client
}

export async function getDb(): Promise<Db> {
  const c = await getClient()
  return c.db()
}

export async function getCollection<T extends Document = Document>(name: string): Promise<Collection<T>> {
  const database = await getDb()
  return database.collection<T>(name)
}
