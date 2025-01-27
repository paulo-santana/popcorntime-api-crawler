/* eslint-disable no-await-in-loop */
import {
  PopcornAnimesAdapter,
  PopcornMoviesAdapter,
  PopcornSeriesAdapter,
} from '@/data/adapters'
import {
  IAnimesApi,
  IMoviesApi,
  IPopcornTimeStatusApi,
  ISeriesApi,
  PopcornApiStatus,
} from '@/data/api'
import { Anime, Movie, Series } from '@/data/models'
import { IRepository } from '@/data/repositories'
import { ISlugger } from '@/utils'
import { ILogger, Logger as CatalogLogger } from '../logger/Logger'

import { CrawlerEventReasons, CrawlerEvents, CrawlerStatus } from '.'

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
  moviesRepository: IRepository<Movie>
  seriesRepository: IRepository<Series>
  animesRepository: IRepository<Anime>
}

export type Observer = {
  event: CrawlerEvents
  observerFunction: (reason: CrawlerEventReasons) => void
}

export interface IStorageManager {
  saveData(key: string, data: Record<string, unknown>): Promise<void>
  getData(key: string): Promise<unknown>
}

export type CrawlerConfig = {
  apiClients: ApiClientTypes
  slugger: ISlugger
  repositories: RepositoryTypes
  adapters: AdapterTypes
  storageManager: IStorageManager
  forceCrawlWhenNotIdle?: boolean
  logger?: ILogger
  loggingActive?: boolean
  progressActive?: boolean
  progressType?: string
}

export class Crawler {
  observers: Array<Observer> = []
  private _status: CrawlerStatus = CrawlerStatus.Idle
  private lastApiStatus?: PopcornApiStatus
  private currentApiStatus?: PopcornApiStatus

  private apiClients: ApiClientTypes
  private slugger: ISlugger
  private repositories: RepositoryTypes
  private adapters: AdapterTypes
  private logger: ILogger
  private storageManager: IStorageManager

  private forceCrawlWhenNotIdle: boolean

  private loggingActive: boolean
  private progressActive: boolean
  private progressType: string

  lastUpdate = 0

  private readonly apiFile = 'apiStatus.json'

  get status(): string {
    return this._status
  }

  private constructor(config: CrawlerConfig) {
    this.apiClients = config.apiClients
    this.slugger = config.slugger
    this.repositories = config.repositories
    this.adapters = config.adapters

    this.storageManager = config.storageManager

    this.forceCrawlWhenNotIdle = config.forceCrawlWhenNotIdle || false

    this.logger = config.logger || new CatalogLogger()
    this.loggingActive = config.loggingActive || false
    this.progressActive = config.progressActive || false
    this.progressType = config.progressType || 'progress'
  }

  static async CreateAsync(config: CrawlerConfig): Promise<Crawler> {
    const me = new Crawler(config)

    const lastSavedStatus = (await me.storageManager.getData(
      me.apiFile
    )) as PopcornApiStatus
    if (lastSavedStatus) {
      me.lastApiStatus = lastSavedStatus
    }

    return me
  }

  private log(message: string) {
    if (this.loggingActive) {
      this.logger.print('Crawler', message)
    }
  }

  private startProgress(
    size: number
  ): (prefix?: string, current?: number) => void {
    if (this.progressActive) {
      if (this.progressType === 'progress') {
        return this.logger.startProgress(size)
      }

      return (prefix?: string, current?: number) => {
        this.log(`${prefix} - downloading page ${current}/${size}`)
      }
    }
    return () => ({})
  }

  async start(): Promise<void> {
    this.log('crawling started!')
    this._status = CrawlerStatus.Crawling

    this.log('getting API status')
    const { statusApi } = this.apiClients
    this.currentApiStatus = await statusApi.getStatus()
    this.log('getting API status: done!')

    if (!this.currentApiStatus) throw new Error('Falhou no engano')
    this.storageManager.saveData(this.apiFile, this.currentApiStatus)

    if (!this.forceCrawlWhenNotIdle) {
      if (this.currentApiStatus.status !== 'Idle') {
        this.log('API is not Idle. Stopping crawl')
        this.notifyFor(CrawlerEvents.Stop, CrawlerEventReasons.ApiNotIdle)
        this.stop()
        return
      }
    }

    if (this.lastApiStatus) {
      if (this.lastApiStatus.updated >= this.currentApiStatus.updated) {
        this.log('API has no update. Stopping crawl')
        this.stop()
        this.notifyFor(CrawlerEvents.Stop, CrawlerEventReasons.ApiNotUpdated)
        return
      }
    }

    this.log('starting crawl engines')
    await this.crawl()

    this.log('crawling done!')
    this.notifyFor(CrawlerEvents.Stop, CrawlerEventReasons.CrawlingFinished)
    this.stop()
  }

  stop(): void {
    this._status = CrawlerStatus.Idle
    this.lastApiStatus = this.currentApiStatus
    this.log('crawl stopped')
  }

  private async crawl(): Promise<void> {
    if (!this.currentApiStatus || !this.lastApiStatus) {
      await this.crawlMovies()
      await this.crawlSeries()
      await this.crawlAnimes()
    } else {
      if (this.currentApiStatus.totalMovies > this.lastApiStatus.totalMovies) {
        await this.crawlMovies()
      } else {
        this.log('(movies) - no new movies, skipping')
      }

      if (this.currentApiStatus.totalShows > this.lastApiStatus.totalShows) {
        await this.crawlSeries()
      } else {
        this.log('(series) - no new series, skipping')
      }

      if (this.currentApiStatus.totalAnimes > this.lastApiStatus.totalAnimes) {
        await this.crawlAnimes()
      } else {
        this.log('(animes) - no new animes, skipping')
      }
    }
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
    this.log('crawling movies!')
    const { moviesApi } = this.apiClients

    this.log('(movies) - fetching movies pages')
    const pages = await moviesApi.getPages()
    this.log(`(movies) - there are ${pages.length} pages 😳!`)

    const { adaptMovies } = this.adapters.popcornMoviesAdapter
    const movies: Movie[] = []

    const tickProgress = this.startProgress(pages.length)

    for (let i = 0; i < pages.length; i++) {
      tickProgress('(movies)', i + 1)
      const page = pages[i]
      // eslint-disable-next-line no-await-in-loop
      const popcornMovies = await moviesApi.getByPage(page)
      const adaptedMovies = adaptMovies(popcornMovies)
      movies.push(...adaptedMovies)
    }

    const newSluggedMovies = await this.filterAndSlugNewMovies(movies)

    if (newSluggedMovies.length > 0) {
      this.repositories.moviesRepository.saveMany(newSluggedMovies)
    } else {
      this.log('(movies) - Strangely enough, there is no new movie to save...')
    }
  }

  private async filterAndSlugNewMovies(movies: Movie[]): Promise<Movie[]> {
    const oldMovies: Movie[] = await this.repositories.moviesRepository.getAll()
    const newMovies = movies.filter(
      x => !oldMovies.some(oldMovie => oldMovie._id === x._id)
    )
    const oldMoviesSlugs = oldMovies.map(movie => movie.slug)
    const newSluggedMovies = this.slugifyMovies(newMovies, oldMoviesSlugs)
    return newSluggedMovies
  }

  async slugifyMovies(
    movies: Movie[],
    oldMoviesSlugs: string[]
  ): Promise<Movie[]> {
    const firstSluggedMovies = movies.map(movie => {
      const sluggedMovie: Movie = { ...movie }
      sluggedMovie.slug = this.slugger.slug(movie.title)
      return sluggedMovie
    })

    const sluggedMovies = firstSluggedMovies.map(movie => {
      if (oldMoviesSlugs.includes(movie.slug)) {
        const newSluggedMovie: Movie = {
          ...movie,
          slug: this.slugger.slugWithId(movie.title, movie._id),
        }
        return newSluggedMovie
      }
      return movie
    })
    return sluggedMovies
  }

  async crawlSeries(): Promise<void> {
    this.log('crawling series!')
    const { seriesApi } = this.apiClients
    this.log('(series) - fetching series pages')
    const pages = await seriesApi.getPages()
    this.log(`(series) - there are ${pages.length} pages`)

    const { adaptSeries } = this.adapters.popcornSeriesAdapter
    const series: Series[] = []

    const tickProgress = this.startProgress(pages.length)

    for (let i = 0; i < pages.length; i++) {
      tickProgress('(series)', i + 1)
      const page = pages[i]
      const foundShows = await seriesApi.getByPage(page)
      const adaptedSeries = adaptSeries(foundShows)
      series.push(...adaptedSeries)
    }

    const newSeries = await this.filterNewSeries(series)

    if (newSeries.length > 0) {
      this.repositories.seriesRepository.saveMany(newSeries)
    } else {
      this.log('(series) - No new series this time...')
    }
  }

  private async filterNewSeries(series: Series[]): Promise<Series[]> {
    const allOldSeries: Series[] = await this.repositories.seriesRepository.getAll()
    const newSeries = series.filter(
      x => !allOldSeries.some(oldSeries => oldSeries._id === x._id)
    )
    return newSeries
  }

  async crawlAnimes(): Promise<void> {
    this.log('crawling animes!')
    const { animesApi } = this.apiClients

    this.log('(animes) - fetching animes pages')
    const pages = await animesApi.getPages()
    this.log(`(animes) - there are ${pages.length} pages`)

    const { adaptAnimes } = this.adapters.popcornAnimesAdapter
    const animes: Anime[] = []

    const tickProgress = this.startProgress(pages.length)

    for (let i = 0; i < pages.length; i++) {
      tickProgress('(animes)', i + 1)
      const page = pages[i]
      const foundAnimes = await animesApi.getByPage(page)
      const adaptedAnimes = adaptAnimes(foundAnimes)
      animes.push(...adaptedAnimes)
    }

    const newAnimes = await this.filterNewAnimes(animes)

    if (newAnimes.length > 0) {
      this.repositories.animesRepository.saveMany(newAnimes)
    } else {
      this.log('(animes) - no new animes this time')
    }
  }

  private async filterNewAnimes(animes: Anime[]): Promise<Anime[]> {
    const oldAnimes: Anime[] = await this.repositories.animesRepository.getAll()
    const newAnimes = animes.filter(
      x => !oldAnimes.some(oldAnime => oldAnime._id === x._id)
    )
    return newAnimes
  }
}
