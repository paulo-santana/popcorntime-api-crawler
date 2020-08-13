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
  getById(id: string): Promise<PopcornMovie>
}

export interface ISeriesApi extends IPopcornTimeResourcesApi {
  getByPage(page: string): Promise<Array<PopcornShow>>
  getById(id: string): Promise<PopcornShow>
}

export interface IAnimesApi extends IPopcornTimeResourcesApi {
  getByPage(page: string): Promise<Array<PopcornAnime>>
  getById(id: string): Promise<PopcornAnime>
}
