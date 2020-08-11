import { IMoviesApi, IPopcornTimeStatusApi } from '@/data/api'
import PopcornMovieAdapter from '@/data/helpers/PopcornMovieAdapter'
import { Movie } from '@/data/models/Movie'
import { MovieRepository } from '@/data/repositories'
import { PopcornApiStatus, IPopcornTimeApi } from '@/services'
import { Slugger } from '@/utils'
import { PopcornMovie } from '@/services/popcornTimeTypes'

export enum CrawlerStatus {
  Idle = 'IDLE',
  Crawling = 'CRAWLING',
}

export type ApiClientTypes = {
  statusApi: IPopcornTimeStatusApi
  moviesApi: IMoviesApi
  seriesApi: IPopcornTimeApi
  animesApi: IPopcornTimeApi
}

export type CrawlerConfig = {
  apiClients: ApiClientTypes
  slugger: Slugger
  movieRepository: MovieRepository
  popcornMovieAdapter: PopcornMovieAdapter
}

export class Crawler {
  private _status: CrawlerStatus = CrawlerStatus.Idle
  private lastApiStatus?: PopcornApiStatus

  private apiClients: ApiClientTypes
  private slugger: Slugger
  private movieRepository: MovieRepository
  private popcornMovieAdapter: PopcornMovieAdapter
  lastUpdate = 0

  get status(): string {
    return this._status
  }

  constructor(config: CrawlerConfig) {
    this.apiClients = config.apiClients
    this.slugger = config.slugger
    this.movieRepository = config.movieRepository
    this.popcornMovieAdapter = config.popcornMovieAdapter
  }

  async start(): Promise<void> {
    this._status = CrawlerStatus.Crawling
    await this.crawl()
  }

  stop(): void {
    this._status = CrawlerStatus.Idle
  }

  async crawl(): Promise<void> {
    await this.crawlMovies()
  }

  async crawlMovies(): Promise<void> {
    const { statusApi, moviesApi } = this.apiClients

    const currentApiStatus = await statusApi.getStatus()

    if (!currentApiStatus) throw new Error('Falhou no engano')

    if (this.lastApiStatus) {
      if (this.lastApiStatus?.updated >= currentApiStatus.updated) {
        this.stop()
        return
      }
    }

    this.lastApiStatus = currentApiStatus

    const pages = await moviesApi.getPages()

    const popcornMovies: PopcornMovie[] = []
    pages.forEach(async page => {
      const foundMovies = await moviesApi.getByPage(page)
      popcornMovies.push(...foundMovies)
    })

    // const movies = this.popcornMovieAdapter.adaptMovies(popcornMovies)
    // const newMovies = this.filterNewMovies(movies)
    // const sluggedMovies = this.slugifyMovies(newMovies)
    // this.movieRepository.saveMany(sluggedMovies)
  }

  private filterNewMovies(movies: Movie[]): Movie[] {
    return movies
  }

  private slugifyMovies(movies: Movie[]): Movie[] {
    const sluggedMovies = movies.map(movie => {
      const sluggedMovie = { ...movie }
      sluggedMovie.slug = this.slugger.slug(movie.title)
      return movie
    })
    return sluggedMovies
  }
}
