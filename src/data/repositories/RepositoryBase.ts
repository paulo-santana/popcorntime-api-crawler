import { Collection } from 'mongodb'
import { MongoHelper } from './helpers/MongoHelper'

export interface IRepository<T> {
  getAll(): Promise<T[]>
  saveMany(entities: T[]): void
}

export class RepositoryBase<T> implements IRepository<T> {
  private readonly collection: Collection

  constructor(collectionName: string) {
    this.collection = MongoHelper.getCollection(collectionName)
  }

  async saveMany(entities: T[]): Promise<void> {
    await this.collection.insertMany(entities, {
      ordered: false,
    })
  }

  async getAll(): Promise<T[]> {
    const entities = await this.collection.find().toArray()
    return entities
  }
}
