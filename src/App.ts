import dotenv from 'dotenv'
import { CrawlerServer } from './app/server/server'
import { CronScheduler, IScheduler } from './app/scheduler'
import { Crawler, CrawlerEventReasons, CrawlerEvents } from './app/crawler'
import {
  PopcornAnimesAdapter,
  PopcornMoviesAdapter,
  PopcornSeriesAdapter,
} from './data/adapters'
import { AnimesApi, MoviesApi, SeriesApi, StatusApi } from './data/api'
import {
  AnimesRepository,
  MoviesRepository,
  SeriesRepository,
} from './data/repositories'
import { MongoHelper } from './data/repositories/helpers/MongoHelper'
import { AxiosHttpClient } from './services/HttpClient'
import { JsonFileEditor, Slugger } from './utils'

dotenv.config()

class App {
  async run(): Promise<void> {
    const slugger = new Slugger()

    const {
      STATUS_BASE_URL,
      ANIME_BASE_URL,
      MOVIE_BASE_URL,
      SERIES_BASE_URL,
    } = process.env

    if (
      STATUS_BASE_URL === undefined ||
      ANIME_BASE_URL === undefined ||
      MOVIE_BASE_URL === undefined ||
      SERIES_BASE_URL === undefined
    ) {
      throw new Error('A URL was not defined')
    }

    const popcornAnimesAdapter = new PopcornAnimesAdapter()
    const popcornMoviesAdapter = new PopcornMoviesAdapter()
    const popcornSeriesAdapter = new PopcornSeriesAdapter()

    const statusClient = new AxiosHttpClient(STATUS_BASE_URL)
    const statusApi = new StatusApi(statusClient)

    const animesClient = new AxiosHttpClient(ANIME_BASE_URL)
    const animesApi = new AnimesApi(animesClient)

    const moviesClient = new AxiosHttpClient(MOVIE_BASE_URL)
    const moviesApi = new MoviesApi(moviesClient)

    const seriesClient = new AxiosHttpClient(SERIES_BASE_URL)
    const seriesApi = new SeriesApi(seriesClient)

    const mongoUri = process.env.MONGO_URL as string

    await MongoHelper.connect(mongoUri)

    const animesRepository = new AnimesRepository('animes')
    const seriesRepository = new SeriesRepository('series')
    const moviesRepository = new MoviesRepository('movies')

    const { FORCE_CRAWL_WHEN_NOT_IDLE } = process.env
    const crawler = await Crawler.CreateAsync({
      slugger,
      adapters: {
        popcornAnimesAdapter,
        popcornMoviesAdapter,
        popcornSeriesAdapter,
      },
      apiClients: {
        statusApi,
        animesApi,
        moviesApi,
        seriesApi,
      },
      repositories: {
        animesRepository,
        seriesRepository,
        moviesRepository,
      },
      storageManager: new JsonFileEditor(),
      loggingActive: true,
      progressActive: true,
      forceCrawlWhenNotIdle: !!FORCE_CRAWL_WHEN_NOT_IDLE,
    })

    const { MAIN_CRON, SECONDARY_CRON } = process.env
    if (MAIN_CRON === undefined || SECONDARY_CRON === undefined) {
      throw new Error('Cron times not specified')
    }

    const scheduler = new CronScheduler(MAIN_CRON, {
      loggingActive: true,
    })

    scheduler.addJob(function crawlerStartJob() {
      crawler.start()
    })

    const logEvent = (reason: CrawlerEventReasons) => {
      if (reason === CrawlerEventReasons.CrawlingFinished) {
        console.log('Funcionou porra!!')
      } else {
        console.log(`Crawling stopped due to reason: "${reason}"`)
        console.log('Rescheduling...')
      }
    }

    let wasRescheduled = false
    crawler.subscribe(CrawlerEvents.Stop, reason => {
      switch (reason) {
        case CrawlerEventReasons.ApiNotIdle:
          scheduler.reschedule(SECONDARY_CRON)
          wasRescheduled = true
          logEvent(reason)
          break
        case CrawlerEventReasons.ApiNotUpdated:
        case CrawlerEventReasons.CrawlingFinished:
        default:
          if (wasRescheduled) {
            scheduler.reschedule(MAIN_CRON) // back to default
            wasRescheduled = false
          }
          logEvent(reason)
      }
    })

    const { CRAWL_ON_STARTUP } = process.env
    if (CRAWL_ON_STARTUP && CRAWL_ON_STARTUP === 'yes') await crawler.start()

    scheduler.start()
    this.startServer(scheduler)
  }

  private startServer(scheduler: IScheduler) {
    const { PORT } = process.env
    if (PORT === undefined) throw new Error('PORT not defined')
    // eslint-disable-next-line radix
    const server = new CrawlerServer(Number.parseInt(PORT), scheduler)
    server.start()
  }
}

export default App
