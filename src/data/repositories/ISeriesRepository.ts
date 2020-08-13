import { Series } from '../models/Series'

export interface ISeriesRepository {
  getAll(): Promise<Series[]>
  saveMany(series: Series[]): void
}
