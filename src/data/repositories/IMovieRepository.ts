import { Movie } from '../models/Movie'

export interface IMovieRepository {
  getAll(): Promise<Movie[]>
  saveMany(movies: Movie[]): void
}
