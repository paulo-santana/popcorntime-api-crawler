import { PopcornSeriesAdapter } from '@/data/adapters'
import { Series } from '@/data/models'
import { SeriesRepository } from '@/data/repositories'
import { MongoHelper } from '@/data/repositories/helpers/MongoHelper'
import { apiResources } from '@/__tests__/helpers/mocks/mocks'

const { MONGO_URL } = process.env

beforeAll(async () => {
  if (MONGO_URL !== undefined && MONGO_URL !== '') {
    await MongoHelper.connect(MONGO_URL)
  }
})

afterEach(async () => {
  await MongoHelper.getCollection('series').deleteMany({})
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

const makeSut = () => {
  const seriesRepository = new SeriesRepository('series')

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
    const savedSeries = await MongoHelper.getCollection('series')
      .find()
      .toArray()
    expect(series).toEqual(savedSeries)
  })

  it('gets the list of all series in the database', async () => {
    const { series, seriesRepository } = makeSut()
    await MongoHelper.getCollection('series').insertMany(series)
    const allSeries = await seriesRepository.getAll()
    expect(allSeries).toEqual(series)
  })
})
