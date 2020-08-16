import { Anime } from '../models/Anime'
import { IDatabaseClient } from '../database/IDatabaseClient'

export interface IAnimesRepository {
  getAll(): Promise<Anime[]>
  saveMany(animes: Anime[]): void
}

export class AnimesRepository implements IAnimesRepository {
  databaseClient: IDatabaseClient

  constructor(databaseClient: IDatabaseClient) {
    this.databaseClient = databaseClient
  }

  async getAll(): Promise<Anime[]> {
    return this.databaseClient.getAll()
  }

  async saveMany(animes: Anime[]): Promise<void> {
    await this.databaseClient.saveMany(animes)
  }
}
