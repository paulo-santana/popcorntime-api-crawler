import { Movie } from '@/data/models/Movie'
import { IDatabaseClient } from '@/data/database/IDatabaseClient'

export interface IMoviesRepository {
  getAll(): Promise<Movie[]>
  saveMany(movies: Movie[]): void
}

export class MoviesRepository {
  private readonly databaseClient: IDatabaseClient

  constructor(databaseClient: IDatabaseClient) {
    this.databaseClient = databaseClient
  }

  async saveMany(movies: Movie[]): Promise<void> {
    await this.databaseClient.saveMany(movies)
  }

  async getAll(): Promise<Array<Movie>> {
    return this.databaseClient.getAll()
  }
}
