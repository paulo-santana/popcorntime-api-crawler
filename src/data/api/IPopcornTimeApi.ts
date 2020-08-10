import { PopcornResource } from '@/services/popcornTimeTypes'

export type PopcornApiStatus = {
  server: string
  status: string | 'Scraping EZTV'
  totalAnimes: number
  totalMovies: number
  totalShows: number
  updated: number
  uptime: number
  version: string
  commit: string
}

export interface IPopcornTimeApi {
  getStatus(): Promise<PopcornApiStatus>
  getPages(): Promise<Array<string>>
  getByPage(page: string): Promise<Array<PopcornResource>>
  getById(id: string): Promise<PopcornResource>
}
