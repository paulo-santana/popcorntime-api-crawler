import { Movie } from '../models/Movie'

export interface IMovieRepository {
  saveMany(movies: Movie[]): void
}
