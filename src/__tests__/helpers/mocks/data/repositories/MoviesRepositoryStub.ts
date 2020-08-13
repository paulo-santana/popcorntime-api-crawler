import { IMoviesRepository } from '@/data/repositories/IMovieRepository'
import { Movie } from '@/data/models/Movie'
import { PopcornMoviesAdapter } from '@/data/adapters/PopcornMoviesAdapter'
import { Slugger } from '@/utils/Slugger'
import { apiResources, moviesPagesTypes } from '../../mocks'

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
  simulatePreviousCrawlAndReturnUnsavedMovies(): Movie[] {
    const adapter = new PopcornMoviesAdapter()
    const slugger = new Slugger()
    const moviesToSend = []
    for (let i = 0; i < moviesPagesTypes.length; i++) {
      const page = moviesPagesTypes[i]

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
