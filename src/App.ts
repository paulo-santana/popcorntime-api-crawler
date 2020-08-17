import { Crawler, CrawlerEvents, CrawlerEventReasons } from './app/crawler'
import { Slugger } from './utils'
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

class App {
  async run(): Promise<void> {
    console.log('Application starting')
    console.log('Setting up dependencies')

    const slugger = new Slugger()

    const popcornAnimesAdapter = new PopcornAnimesAdapter()
    const popcornMoviesAdapter = new PopcornMoviesAdapter()
    const popcornSeriesAdapter = new PopcornSeriesAdapter()

    const statusBaseUrl = 'https://anime.api-fetch.sh'
    const statusClient = new AxiosHttpClient(statusBaseUrl)
    const statusApi = new StatusApi(statusClient)

    const animeBaseUrl = 'https://anime.api-fetch.sh'
    const animesClient = new AxiosHttpClient(animeBaseUrl)
    const animesApi = new AnimesApi(animesClient)

    const moviesBaseUrl = 'https://movies-v2.api-fetch.sh'
    const moviesClient = new AxiosHttpClient(moviesBaseUrl)
    const moviesApi = new MoviesApi(moviesClient)

    const seriesBaseUrl = 'https://tv-v2.api-fetch.sh'
    const seriesClient = new AxiosHttpClient(seriesBaseUrl)
    const seriesApi = new SeriesApi(seriesClient)

    const mongoUri = 'mongodb://localhost:27017/catalog'
    console.log('awaiting for database to connect...')
    await MongoHelper.connect(mongoUri)
    console.log('done!')

    const animesRepository = new AnimesRepository('animes')
    const seriesRepository = new SeriesRepository('series')
    const moviesRepository = new MoviesRepository('movies')

    const crawler = new Crawler({
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
    })

    const scheduler = new NodeCronScheduler('34 * * * *') // hourly
    scheduler.addJob(() => {
      console.log('running crawler!')
      crawler.start()
    })

    const logEvent = (reason: CrawlerEventReasons) => {
      console.log(`Crawling stoped due to reason: "${reason}"`)
      console.log('Rescheduling...')
    }

    let wasRescheduled = false
    crawler.subscribe(CrawlerEvents.Stop, reason => {
      switch (reason) {
        case CrawlerEventReasons.ApiNotIdle:
          scheduler.reschedule('*/2 * * * *') // try again every two minutes
          wasRescheduled = true
          logEvent(reason)
          break
        case CrawlerEventReasons.ApiNotUpdated:
        case CrawlerEventReasons.CrawlingFinished:
        default:
          if (wasRescheduled) {
            scheduler.reschedule('0 * * * *') // back to default
            wasRescheduled = false
          }
          logEvent(reason)
      }
    })

    console.log('starting scheduler!')
    scheduler.start()
    console.log('Setup done!')
    console.log('Patiently awaiting the next crawl time schedule...')
  }
}

export default App
