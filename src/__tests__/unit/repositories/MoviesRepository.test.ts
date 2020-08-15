import { PopcornMoviesAdapter } from '@/data/adapters/PopcornMoviesAdapter'
import { IDatabaseClient } from '@/data/database/IDatabaseClient'
import { Movie } from '@/data/models/Movie'
import { MoviesRepository } from '@/data/repositories/MoviesRepository'
import { Slugger } from '@/utils'
import { apiResources } from '../../helpers/mocks/mocks'

const makeSut = () => {
  class DatabaseClientSpy implements IDatabaseClient<Movie> {
    pool: Array<Movie> = []

    async saveMany(movies: Movie[]): Promise<void> {
      this.pool.push(...movies)
      return Promise.resolve()
    }

    async getAll(): Promise<Array<Movie>> {
      return this.pool
    }
  }

  const databaseClientSpy = new DatabaseClientSpy()
  const moviesRepository = new MoviesRepository(databaseClientSpy)

  const moviesFactory = () => {
    const popcornMovies = apiResources.movies['movies/1']
    const slugger = new Slugger()
    const adapter = new PopcornMoviesAdapter()
    const adaptedMovies = adapter.adaptMovies(popcornMovies)
    const movies = adaptedMovies.map(
      (movie): Movie => ({
        ...movie,
        slug: slugger.slug(movie.title),
      })
    )

    return movies
  }

  return {
    moviesRepository,
    databaseClient: databaseClientSpy,
    movies: moviesFactory(),
  }
}

describe('Movies Repository', () => {
  it('saves a list of movies correctly', async () => {
    const { moviesRepository, databaseClient, movies } = makeSut()
    const saveMany = jest.spyOn(databaseClient, 'saveMany')
    await moviesRepository.saveMany(movies)
    expect(saveMany).toHaveBeenCalledWith(movies)
  })

  it('gets the list of all movies in the database', async () => {
    const { moviesRepository, databaseClient, movies } = makeSut()
    const getAll = jest.spyOn(databaseClient, 'getAll')
    databaseClient.pool.push(...movies)
    const allMovies = await moviesRepository.getAll()
    expect(getAll).toHaveBeenCalled()
    expect(allMovies).toEqual(movies)
  })
})
