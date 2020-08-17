import { PopcornMoviesAdapter } from '@/data/adapters/PopcornMoviesAdapter'
import { Movie } from '@/data/models/Movie'
import { MongoHelper } from '@/data/repositories/helpers/MongoHelper'
import { MoviesRepository } from '@/data/repositories/MoviesRepository'
import { Slugger } from '@/utils'
import { apiResources } from '../../helpers/mocks/mocks'

const { MONGO_URL } = process.env

beforeAll(async () => {
  if (MONGO_URL !== undefined && MONGO_URL !== '') {
    await MongoHelper.connect(MONGO_URL)
  }
})

afterEach(async () => {
  await MongoHelper.getCollection('movies').deleteMany({})
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

const makeSut = () => {
  const moviesRepository = new MoviesRepository('movies')

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
    movies: moviesFactory(),
  }
}

describe('Movies Repository', () => {
  it('saves a list of movies correctly', async () => {
    const { moviesRepository, movies } = makeSut()
    await moviesRepository.saveMany(movies)
    const savedMovies = await MongoHelper.getCollection('movies')
      .find()
      .toArray()
    expect(savedMovies).toEqual(movies)
  })

  it('gets the list of all movies in the database', async () => {
    const { moviesRepository, movies } = makeSut()
    await MongoHelper.getCollection('movies').insertMany(movies)
    const allMovies = await moviesRepository.getAll()
    expect(allMovies).toEqual(movies)
  })
})
