import { ISeriesRepository } from '@/data/repositories/ISeriesRepository'
import { Serie } from '@/data/models/Serie'
import PopcornSerieAdapter from '@/data/helpers/PopcornSerieAdapter'
import { apiResources, showsPages } from '../apiResources'

const { shows } = apiResources

export class SeriesRepositoryStub implements ISeriesRepository {
  seriesPool: Serie[] = []

  /**
   * saves movies for each page, letting only one unsaved by page
   * returning them
   * @returns Movie[] - The movies which were not saved
   */
  simulatePreviousCralAndReturnUnsavedSeries(): Serie[] {
    const adapter = new PopcornSerieAdapter()
    const moviesToSend = []
    for (let i = 0; i < showsPages.length; i++) {
      const page = showsPages[i]

      const adaptedMovies = adapter.adaptSeries(shows[page])

      // by starting at 1, we don't save index 0 and send it as return value
      for (let j = 1; j < adaptedMovies.length; j++) {
        this.seriesPool.push(adaptedMovies[j])
      }

      const movieToSend: Serie = {
        ...adaptedMovies[0],
      }
      moviesToSend.push(movieToSend)
    }

    return moviesToSend
  }

  getAll(): Promise<Serie[]> {
    return new Promise(resolve => resolve(this.seriesPool))
  }

  saveMany(series: Serie[]): void {
    this.seriesPool.push(...series)
  }
}
