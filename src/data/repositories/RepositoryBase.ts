import { Db, Collection } from 'mongodb'

export interface IRepository<T> {
  getAll(): Promise<T[]>
  saveMany(entities: T[]): void
}

export class RepositoryBase<T> implements IRepository<T> {
  private readonly collection: Collection

  constructor(db: Db, collectionName: string) {
    this.collection = db.collection(collectionName)
  }

  async saveMany(entities: T[]): Promise<void> {
    await this.collection.insertMany(entities)
  }

  async getAll(): Promise<T[]> {
    const entities = await this.collection.find().toArray()
    return entities
  }
}
