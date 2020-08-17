import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as null | MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  },

  async disconnect(): Promise<void> {
    this.client?.close()
  },

  getCollection(name: string): Collection {
    if (this.client === null) throw new Error('Client not connected')
    return this.client.db().collection(name)
  },
}
