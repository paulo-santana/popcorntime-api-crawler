import { Movie } from '../models/Movie'
import { Series } from '../models/Series'
import { Anime } from '../models/Anime'

export interface IDatabaseClient<T = Movie | Series | Anime> {
  saveMany(items: T[]): Promise<void>
  getAll(): Promise<Array<T>>
}
