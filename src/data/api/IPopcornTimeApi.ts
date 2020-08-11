import { PopcornMovie } from '@/services/popcornTimeTypes'

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
  getPages(): Promise<Array<string>>
}

export interface IMoviesApi extends IPopcornTimeApi {
  getByPage(page: string): Promise<Array<PopcornMovie>>
  getById(id: string): Promise<PopcornMovie>
}
