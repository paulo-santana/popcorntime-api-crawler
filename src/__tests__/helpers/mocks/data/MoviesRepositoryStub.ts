import { IMoviesRepository } from '@/data/repositories/IMovieRepository'
import { Movie } from '@/data/models/Movie'
import PopcornMovieAdapter from '@/data/helpers/PopcornMovieAdapter'
import { Slugger } from '@/utils/Slugger'
import { apiResources, moviesPages } from '../apiResources'

const { movies } = apiResources

export class MoviesRepositoryStub implements IMoviesRepository {
  getAll(): Promise<Movie[]> {
    return new Promise(resolve => resolve(this.moviesPool))
  }
  /**
   * saves movies for each page, letting only one unsaved by page
   * returning them
   * @returns Movie[] - The movies which were not saved
   */
  simulatePreviousCralAndReturnUnsavedMovies(): Movie[] {
    const adapter = new PopcornMovieAdapter()
    const slugger = new Slugger()
    const moviesToSend = []
    for (let i = 0; i < moviesPages.length; i++) {
      const page = moviesPages[i]

      const adaptedMovies = adapter.adaptMovies(movies[page])

      // by starting at 1, we don't save index 0 and send it as return value
      for (let j = 1; j < adaptedMovies.length; j++) {
        adaptedMovies[j].slug = slugger.slug(adaptedMovies[j].title)
        this.moviesPool.push(adaptedMovies[j])
      }

      adaptedMovies[0].slug = slugger.slug(adaptedMovies[0].title)
      moviesToSend.push(adaptedMovies[0])
    }

    return moviesToSend
  }
  moviesPool: Movie[] = []
  saveMany(moviesToSave: Movie[]): void {
    this.moviesPool.push(...moviesToSave)
  }
}
