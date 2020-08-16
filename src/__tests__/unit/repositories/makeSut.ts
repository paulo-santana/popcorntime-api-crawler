import { IDatabaseClient } from '@/data/database/IDatabaseClient'
import { Series } from '@/data/models/Series'
import { apiResources } from '@/__tests__/helpers/mocks/mocks'
import { PopcornSeriesAdapter } from '@/data/adapters/PopcornSeriesAdapter'
const makeSut = () => {
  class DatabaseClientSpy implements IDatabaseClient<Series> {
    pool: Array<Series> = []

    saveMany(items: Series[]): Promise<void> {
      this.pool.push(...items)
      return Promise.resolve()
    }

    getAll(): Promise<Series[]> {
      return Promise.resolve(this.pool)
    }
  }

  class SeriesRepository {
    databaseClient: IDatabaseClient

    constructor(databaseClient: IDatabaseClient) {
      this.databaseClient = databaseClient
    }

    async saveMany(items: Series[]): Promise<void> {
      await this.databaseClient.saveMany(items)
    }

    getAll(): Promise<Series[]> {
      return this.databaseClient.getAll()
    }
  }
  const databaseClientSpy = new DatabaseClientSpy()
  const seriesRepository = new SeriesRepository(databaseClientSpy)

  const seriesFactory = () => {
    const popcornShows = apiResources.shows['shows/1']
    const adapter = new PopcornSeriesAdapter()
    const series = adapter.adaptSeries(popcornShows)
    return series
  }

  return {
    seriesRepository,
    databaseClientSpy,
    series: seriesFactory(),
  }
}
describe('Series Repository', () => {
  it('saves a list of series correctly', async () => {
    const { seriesRepository, databaseClientSpy, series } = makeSut()
    const saveMany = jest.spyOn(databaseClientSpy, 'saveMany')
    await seriesRepository.saveMany(series)
    expect(saveMany).toHaveBeenCalledWith(series)
  })

  it('gets the list of all series in the database', async () => {
    const { series, databaseClientSpy, seriesRepository } = makeSut()
    const getAll = jest.spyOn(databaseClientSpy, 'getAll')
    databaseClientSpy.pool.push(...series)
    const allSeries = await seriesRepository.getAll()
    expect(getAll).toHaveBeenCalled()
    expect(allSeries).toEqual(series)
  })
})
