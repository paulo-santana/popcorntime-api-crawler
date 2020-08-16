import { Series } from '@/data/models/Series'
import { IDatabaseClient } from '@/data/database/IDatabaseClient'

export interface ISeriesRepository {
  getAll(): Promise<Series[]>
  saveMany(series: Series[]): void
}

export class SeriesRepository {
  databaseClient: IDatabaseClient

  constructor(databaseClient: IDatabaseClient) {
    this.databaseClient = databaseClient
  }

  async saveMany(items: Series[]): Promise<void> {
    await this.databaseClient.saveMany(items)
  }

  getAll(): Promise<Series[]> {
    return this.databaseClient.getAll()
  }
}
