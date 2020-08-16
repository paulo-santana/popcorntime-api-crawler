import { PopcornMoviesAdapter } from '@/data/adapters/PopcornMoviesAdapter'
import { Movie } from '@/data/models/Movie'
import { MoviesRepository } from '@/data/repositories/MoviesRepository'
import { Slugger } from '@/utils'
import dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
import { apiResources } from '../../helpers/mocks/mocks'

dotenv.config()
const { MONGO_URL } = process.env
let client: MongoClient
let db: Db

beforeAll(async () => {
  if (MONGO_URL !== undefined && MONGO_URL !== '') {
    client = await MongoClient.connect(MONGO_URL, {
      useUnifiedTopology: true,
    })
    db = client.db()
  }
})

afterEach(async () => {
  await db.dropCollection('movies')
})

afterAll(async () => {
  await client.close()
})

const makeSut = () => {
  const moviesRepository = new MoviesRepository(db, 'movies')

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
    const savedMovies = await db.collection<Movie>('movies').find().toArray()
    expect(movies).toEqual(savedMovies)
  })

  it('gets the list of all movies in the database', async () => {
    const { moviesRepository, movies } = makeSut()
    await db.collection('movies').insertMany(movies)
    const allMovies = await moviesRepository.getAll()
    expect(allMovies).toEqual(movies)
  })
})
