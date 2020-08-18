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

class App {
  async run(): Promise<void> {
    const slugger = new Slugger()

    const popcornAnimesAdapter = new PopcornAnimesAdapter()
    const popcornMoviesAdapter = new PopcornMoviesAdapter()
    const popcornSeriesAdapter = new PopcornSeriesAdapter()

    const statusBaseUrl = 'http://localhost:3333'
    const statusClient = new AxiosHttpClient(statusBaseUrl)
    const statusApi = new StatusApi(statusClient)

    const animeBaseUrl = 'http://localhost:3333'
    const animesClient = new AxiosHttpClient(animeBaseUrl)
    const animesApi = new AnimesApi(animesClient)

    const moviesBaseUrl = 'http://localhost:3333'
    const moviesClient = new AxiosHttpClient(moviesBaseUrl)
    const moviesApi = new MoviesApi(moviesClient)

    const seriesBaseUrl = 'http://localhost:3333'
    const seriesClient = new AxiosHttpClient(seriesBaseUrl)
    const seriesApi = new SeriesApi(seriesClient)

    const mongoUri = 'mongodb://localhost:27017/catalog'

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

    const scheduler = new NodeCronScheduler('15 6 * * * *') // hourly
    scheduler.addJob(() => {
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

    scheduler.start()
  }
}

export default App
