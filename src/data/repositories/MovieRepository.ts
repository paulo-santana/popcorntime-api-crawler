import { Movie } from '../models/Movie'

export class MovieRepository {
  moviesPool: Movie[] = []

  saveMany(movies: Movie[]): void {
    this.moviesPool.push(...movies)
  }
}
