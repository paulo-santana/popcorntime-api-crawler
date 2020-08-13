import {
  PopcornMovie,
  PopcornShow,
  PopcornAnime,
} from '@/services/popcornTimeTypes'

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

export interface IPopcornTimeResourcesApi {
  getPages(): Promise<Array<string>>
}

export interface IMoviesApi extends IPopcornTimeResourcesApi {
  getByPage(page: string): Promise<Array<PopcornMovie>>
}

export interface ISeriesApi extends IPopcornTimeResourcesApi {
  getByPage(page: string): Promise<Array<PopcornShow>>
}

export interface IAnimesApi extends IPopcornTimeResourcesApi {
  getByPage(page: string): Promise<Array<PopcornAnime>>
}
