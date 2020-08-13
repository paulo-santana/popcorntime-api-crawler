import { Movie } from '../models/Movie'

export interface IMoviesRepository {
  getAll(): Promise<Movie[]>
  saveMany(movies: Movie[]): void
}
