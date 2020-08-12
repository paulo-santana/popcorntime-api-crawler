import { ISeriesRepository } from '@/data/repositories/ISeriesRepository'
import { Serie } from '@/data/models/Serie'

export class SeriesRepositoryStub implements ISeriesRepository {
  seriesPool: Serie[] = []

  getAll(): Promise<Serie[]> {
    return new Promise(resolve => resolve(this.seriesPool))
  }

  saveMany(series: Serie[]): void {
    this.seriesPool.push(...series)
  }
}
