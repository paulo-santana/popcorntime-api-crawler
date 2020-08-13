import { ISeriesRepository } from '@/data/repositories/ISeriesRepository'
import { Serie } from '@/data/models/Serie'
import PopcornSerieAdapter from '@/data/helpers/PopcornSerieAdapter'
import { apiResources, showsPages } from '../apiResources'

const { shows } = apiResources

export class SeriesRepositoryStub implements ISeriesRepository {
  seriesPool: Serie[] = []

  /**
   * saves series for each page, letting only one unsaved by page
   * returning them
   * @returns Serie[] - The series which were not saved
   */
  simulatePreviousCrawlAndReturnUnsavedSeries(): Serie[] {
    const adapter = new PopcornSerieAdapter()
    const seriesToSend = []
    for (let i = 0; i < showsPages.length; i++) {
      const page = showsPages[i]

      const adaptedSeries = adapter.adaptSeries(shows[page])

      // by starting at 1, we don't save index 0 and send it as return value
      for (let j = 1; j < adaptedSeries.length; j++) {
        this.seriesPool.push(adaptedSeries[j])
      }

      seriesToSend.push(adaptedSeries[0])
    }

    return seriesToSend
  }

  getAll(): Promise<Serie[]> {
    return new Promise(resolve => resolve(this.seriesPool))
  }

  saveMany(series: Serie[]): void {
    this.seriesPool.push(...series)
  }
}
