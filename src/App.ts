import dotenv from 'dotenv'
import { Crawler, CrawlerEvents, CrawlerEventReasons } from './app/crawler'
import { Slugger, JsonFileEditor } from './utils'
import {
  PopcornAnimesAdapter,
  PopcornMoviesAdapter,
  PopcornSeriesAdapter,
} from './data/adapters'
import { StatusApi, AnimesApi, MoviesApi, SeriesApi } from './data/api'
import { AxiosHttpClient } from './services/HttpClient'
import {
  AnimesRepository,
  SeriesRepository,
  MoviesRepository,
} from './data/repositories'
import { MongoHelper } from './data/repositories/helpers/MongoHelper'
import { NodeCronScheduler } from './app/scheduler/Scheduler'

dotenv.config()

class App {
  async run(): Promise<void> {
    const slugger = new Slugger()

    const popcornAnimesAdapter = new PopcornAnimesAdapter()
    const popcornMoviesAdapter = new PopcornMoviesAdapter()
    const popcornSeriesAdapter = new PopcornSeriesAdapter()

    const statusBaseUrl = process.env.STATUS_BASE_URL as string
    const statusClient = new AxiosHttpClient(statusBaseUrl)
    const statusApi = new StatusApi(statusClient)

    const animeBaseUrl = process.env.ANIME_BASE_URL as string
    const animesClient = new AxiosHttpClient(animeBaseUrl)
    const animesApi = new AnimesApi(animesClient)

    const moviesBaseUrl = process.env.MOVIE_BASE_URL as string
    const moviesClient = new AxiosHttpClient(moviesBaseUrl)
    const moviesApi = new MoviesApi(moviesClient)

    const seriesBaseUrl = process.env.SERIES_BASE_URL as string
    const seriesClient = new AxiosHttpClient(seriesBaseUrl)
    const seriesApi = new SeriesApi(seriesClient)

    const mongoUri = process.env.MONGO_URL as string

    await MongoHelper.connect(mongoUri)

    const animesRepository = new AnimesRepository('animes')
    const seriesRepository = new SeriesRepository('series')
    const moviesRepository = new MoviesRepository('movies')

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
    })

    const { MAIN_CRON, SECONDARY_CRON } = process.env
    const scheduler = new NodeCronScheduler(MAIN_CRON, {
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
  }
}

export default App
