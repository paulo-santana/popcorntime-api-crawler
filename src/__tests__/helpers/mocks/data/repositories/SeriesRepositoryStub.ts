import { ISeriesRepository } from '@/data/repositories/ISeriesRepository'
import { Series } from '@/data/models/Series'
import { PopcornSeriesAdapter } from '@/data/adapters/PopcornSeriesAdapter'
import { apiResources, showsPagesTypes } from '../../mocks'

const { shows } = apiResources

export class SeriesRepositoryStub implements ISeriesRepository {
  seriesPool: Series[] = []

  /**
   * saves series for each page, letting only one unsaved by page
   * returning them
   * @returns Series[] - The series which were not saved
   */
  simulatePreviousCrawlAndReturnUnsavedSeries(): Series[] {
    const adapter = new PopcornSeriesAdapter()
    const seriesToSend = []
    for (let i = 0; i < showsPagesTypes.length; i++) {
      const page = showsPagesTypes[i]

      const adaptedSeries = adapter.adaptSeries(shows[page])

      // by starting at 1, we don't save index 0 and send it as return value
      for (let j = 1; j < adaptedSeries.length; j++) {
        this.seriesPool.push(adaptedSeries[j])
      }

      seriesToSend.push(adaptedSeries[0])
    }

    return seriesToSend
  }

  getAll(): Promise<Series[]> {
    return new Promise(resolve => resolve(this.seriesPool))
  }

  saveMany(series: Series[]): void {
    this.seriesPool.push(...series)
  }
}
