/* eslint-disable no-await-in-loop */
import { PopcornAnimesAdapter } from '@/data/adapters/PopcornAnimesAdapter'
import { PopcornMoviesAdapter } from '@/data/adapters/PopcornMoviesAdapter'
import { PopcornSeriesAdapter } from '@/data/adapters/PopcornSeriesAdapter'
import {
  IAnimesApi,
  IMoviesApi,
  IPopcornTimeStatusApi,
  ISeriesApi,
  PopcornApiStatus,
} from '@/data/api'
import { Anime } from '@/data/models/Anime'
import { Movie } from '@/data/models/Movie'
import { Series } from '@/data/models/Series'
import { IMoviesRepository } from '@/data/repositories'
import { IAnimesRepository } from '@/data/repositories/IAnimesRepository'
import { ISeriesRepository } from '@/data/repositories/ISeriesRepository'
import {
  PopcornAnime,
  PopcornMovie,
  PopcornShow,
} from '@/services/popcornTimeTypes'
import { ISlugger } from '@/utils'

export enum CrawlerEvents {
  Stop = 'stop',
}

export enum CrawlerEventReasons {
  ApiNotIdle,
  ApiNotUpdated,
}

export enum CrawlerStatus {
  Idle = 'IDLE',
  Crawling = 'CRAWLING',
}

export type ApiClientTypes = {
  statusApi: IPopcornTimeStatusApi
  moviesApi: IMoviesApi
  seriesApi: ISeriesApi
  animesApi: IAnimesApi
}

export type AdapterTypes = {
  popcornMoviesAdapter: PopcornMoviesAdapter
  popcornSeriesAdapter: PopcornSeriesAdapter
  popcornAnimesAdapter: PopcornAnimesAdapter
}
export type RepositoryTypes = {
  moviesRepository: IMoviesRepository
  seriesRepository: ISeriesRepository
  animesRepository: IAnimesRepository
}

export type Observer = {
  event: CrawlerEvents
  observerFunction: (reason: CrawlerEventReasons) => void
}

export type CrawlerConfig = {
  apiClients: ApiClientTypes
  slugger: ISlugger
  repositories: RepositoryTypes
  adapters: AdapterTypes
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
        this.notifyFor(CrawlerEvents.Stop, CrawlerEventReasons.ApiNotUpdated)
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

    const movies = this.adapters.popcornMoviesAdapter.adaptMovies(popcornMovies)
    const newMovies = await this.filterNewMovies(movies)
    const sluggedMovies = this.slugifyMovies(newMovies)
    this.repositories.moviesRepository.saveMany(sluggedMovies)
  }

  private async filterNewMovies(movies: Movie[]): Promise<Movie[]> {
    const oldMovies: Movie[] = await this.repositories.moviesRepository.getAll()
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
      const foundShows = await seriesApi.getByPage(page)
      popcornShows.push(...foundShows)
    }

    const series = this.adapters.popcornSeriesAdapter.adaptSeries(popcornShows)
    const newSeries = await this.filterNewSeries(series)
    this.repositories.seriesRepository.saveMany(newSeries)
  }

  private async filterNewSeries(series: Series[]): Promise<Series[]> {
    const allOldSeries: Series[] = await this.repositories.seriesRepository.getAll()
    const newSeries = series.filter(
      x => !allOldSeries.some(oldSeries => oldSeries._id === x._id)
    )
    return newSeries
  }

  async crawlAnimes(): Promise<void> {
    const { animesApi } = this.apiClients
    const pages = await animesApi.getPages()

    const popcornAnimes: PopcornAnime[] = []
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      const foundAnimes = await animesApi.getByPage(page)
      popcornAnimes.push(...foundAnimes)
    }

    const animes = this.adapters.popcornAnimesAdapter.adaptAnimes(popcornAnimes)
    const newAnimes = await this.filterNewAnimes(animes)
    this.repositories.animesRepository.saveMany(newAnimes)
  }

  private async filterNewAnimes(animes: Anime[]): Promise<Anime[]> {
    const oldAnimes: Anime[] = await this.repositories.animesRepository.getAll()
    const newAnimes = animes.filter(
      x => !oldAnimes.some(oldAnime => oldAnime._id === x._id)
    )
    return newAnimes
  }
}
