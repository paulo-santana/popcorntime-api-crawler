/* eslint-disable no-await-in-loop */
import { IMoviesApi, ISeriesApi, IPopcornTimeStatusApi } from '@/data/api'
import PopcornMovieAdapter from '@/data/helpers/PopcornMovieAdapter'
import { Movie } from '@/data/models/Movie'
import { IMovieRepository } from '@/data/repositories'
import { PopcornApiStatus, IPopcornTimeApi } from '@/services'
import { ISlugger } from '@/utils'
import { PopcornMovie, PopcornShow } from '@/services/popcornTimeTypes'
import PopcornSerieAdapter from '@/data/helpers/PopcornSerieAdapter'
import { ISeriesRepository } from '@/data/repositories/ISeriesRepository'
import { Serie } from '@/data/models/Serie'

export enum CrawlerEvents {
  Stop = 'stop',
}

export enum CrawlerEventReasons {
  ApiNotIdle,
}

export enum CrawlerStatus {
  Idle = 'IDLE',
  Crawling = 'CRAWLING',
}

export type ApiClientTypes = {
  statusApi: IPopcornTimeStatusApi
  moviesApi: IMoviesApi
  seriesApi: ISeriesApi
  animesApi: IPopcornTimeApi
}

export type AdapterTypes = {
  popcornMovieAdapter: PopcornMovieAdapter
  popcornSerieAdapter: PopcornSerieAdapter
}
export type RepositoryTypes = {
  movieRepository: IMovieRepository
  seriesRepository: ISeriesRepository
}

export type CrawlerConfig = {
  apiClients: ApiClientTypes
  slugger: ISlugger
  repositories: RepositoryTypes
  adapters: AdapterTypes
}

export type Observer = {
  event: CrawlerEvents
  observerFunction: (reason: CrawlerEventReasons) => void
}

export class Crawler {
  observers: Array<Observer> = []
  private _status: CrawlerStatus = CrawlerStatus.Idle
  private lastApiStatus?: PopcornApiStatus

  private apiClients: ApiClientTypes
  private slugger: ISlugger
  private repositories: RepositoryTypes
  private adapters: AdapterTypes
  lastUpdate = 0

  get status(): string {
    return this._status
  }

  constructor(config: CrawlerConfig) {
    this.apiClients = config.apiClients
    this.slugger = config.slugger
    this.repositories = config.repositories
    this.adapters = config.adapters
  }

  async start(): Promise<void> {
    this._status = CrawlerStatus.Crawling
    const { statusApi } = this.apiClients
    const currentApiStatus = await statusApi.getStatus()

    if (!currentApiStatus) throw new Error('Falhou no engano')

    if (currentApiStatus.status !== 'Idle') {
      this.notifyFor(CrawlerEvents.Stop, CrawlerEventReasons.ApiNotIdle)
      this.stop()
      return
    }

    if (this.lastApiStatus) {
      if (this.lastApiStatus?.updated >= currentApiStatus.updated) {
        this.stop()
        return
      }
    }

    this.lastApiStatus = currentApiStatus
    await this.crawl()
  }

  stop(): void {
    this._status = CrawlerStatus.Idle
  }

  async crawl(): Promise<void> {
    await this.crawlMovies()
    await this.crawlSeries()
    await this.crawlAnimes()
  }

  subscribe(
    event: CrawlerEvents,
    observerFunction: (reason: CrawlerEventReasons) => void
  ): void {
    this.observers.push({
      event,
      observerFunction,
    })
  }

  private notifyFor(event: CrawlerEvents, reason: CrawlerEventReasons): void {
    this.observers.forEach(observer => {
      if (observer.event === event) {
        observer.observerFunction(reason)
      }
    })
  }

  async crawlMovies(): Promise<void> {
    const { moviesApi } = this.apiClients

    const pages = await moviesApi.getPages()

    const popcornMovies: PopcornMovie[] = []
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      // eslint-disable-next-line no-await-in-loop
      const foundMovies = await moviesApi.getByPage(page)
      popcornMovies.push(...foundMovies)
    }

    const movies = this.adapters.popcornMovieAdapter.adaptMovies(popcornMovies)
    const newMovies = await this.filterNewMovies(movies)
    const sluggedMovies = this.slugifyMovies(newMovies)
    this.repositories.movieRepository.saveMany(sluggedMovies)
  }

  private async filterNewMovies(movies: Movie[]): Promise<Movie[]> {
    const oldMovies: Movie[] = await this.repositories.movieRepository.getAll()
    const newMovies = movies.filter(
      x => !oldMovies.some(oldMovie => oldMovie._id === x._id)
    )
    return newMovies
  }

  slugifyMovies(movies: Movie[]): Movie[] {
    const sluggedMovies = movies.map(movie => {
      const sluggedMovie: Movie = { ...movie }
      sluggedMovie.slug = this.slugger.slug(movie.title)
      return sluggedMovie
    })
    return sluggedMovies
  }

  async crawlSeries(): Promise<void> {
    const { seriesApi } = this.apiClients
    const pages = await seriesApi.getPages()

    const popcornShows: PopcornShow[] = []
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      // eslint-disable-next-line no-await-in-loop
      const foundShows = await seriesApi.getByPage(page)
      popcornShows.push(...foundShows)
    }
    const series = this.adapters.popcornSerieAdapter.adaptSeries(popcornShows)

    const newSeries = await this.filterNewSeries(series)
    this.repositories.seriesRepository.saveMany(newSeries)
  }

  private async filterNewSeries(series: Serie[]): Promise<Serie[]> {
    const oldSeries: Serie[] = await this.repositories.seriesRepository.getAll()
    const newSeries = series.filter(
      x => !oldSeries.some(oldSerie => oldSerie._id === x._id)
    )
    return newSeries
  }

  async crawlAnimes(): Promise<void> {
    const { animesApi } = this.apiClients
    const pages = await animesApi.getPages()

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]

      const foundAnimes = await animesApi.getByPage(page)
    }
  }
}
