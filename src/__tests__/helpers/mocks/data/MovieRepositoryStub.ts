import { IMovieRepository } from '@/data/repositories/IMovieRepository'
import { Movie } from '@/data/models/Movie'

export class MovieRepositoryStub implements IMovieRepository {
  moviesPool: Movie[] = []
  saveMany(movies: Movie[]): void {
    this.moviesPool.push(...movies)
  }
}
