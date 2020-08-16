// eslint-disable-next-line max-classes-per-file
import { PopcornSeriesAdapter } from '@/data/adapters'
import { SeriesRepository } from '@/data/repositories'
import { apiResources } from '@/__tests__/helpers/mocks/mocks'
import { Db, MongoClient } from 'mongodb'
import { Series } from '@/data/models'
import dotenv from 'dotenv'

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
  await db.dropCollection('series')
})

afterAll(async () => {
  await client.close()
})

const makeSut = () => {
  const seriesRepository = new SeriesRepository(db, 'series')

  const seriesFactory = () => {
    const popcornShows = apiResources.shows['shows/1']
    const adapter = new PopcornSeriesAdapter()
    const series = adapter.adaptSeries(popcornShows)
    return series
  }

  return {
    seriesRepository,
    series: seriesFactory(),
  }
}

describe('Series Repository', () => {
  it('saves a list of series correctly', async () => {
    const { seriesRepository, series } = makeSut()
    await seriesRepository.saveMany(series)
    const savedSeries = await db.collection<Series>('series').find().toArray()
    expect(series).toEqual(savedSeries)
  })

  it('gets the list of all series in the database', async () => {
    const { series, seriesRepository } = makeSut()
    await db.collection('series').insertMany(series)
    const allSeries = await seriesRepository.getAll()
    expect(allSeries).toEqual(series)
  })
})
