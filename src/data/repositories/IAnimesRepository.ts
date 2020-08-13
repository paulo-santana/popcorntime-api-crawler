import { Anime } from '../models/Anime'

export interface IAnimesRepository {
  getAll(): Promise<Anime[]>
  saveMany(animes: Anime[]): void
}
