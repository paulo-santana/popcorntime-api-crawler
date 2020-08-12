import { Serie } from '../models/Serie'

export interface ISeriesRepository {
  getAll(): Promise<Serie[]>
  saveMany(series: Serie[]): void
}
