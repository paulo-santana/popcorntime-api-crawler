import { Crawler, CrawlerEventReasons, CrawlerEvents } from '@/app/crawler'
import {
  PopcornAnimesAdapter,
  PopcornMoviesAdapter,
  PopcornSeriesAdapter,
} from '@/data/adapters'
import { Slugger } from '@/utils'
import { AnimesApiStub } from '../helpers/mocks/data/api/AnimesApiStub'
import { MoviesApiStub } from '../helpers/mocks/data/api/MoviesApiStub'
import { SeriesApiStub } from '../helpers/mocks/data/api/SeriesApiStub'
import { StatusApiStub } from '../helpers/mocks/data/api/StatusApiStub'
import { AnimesRepositoryStub } from '../helpers/mocks/data/repositories/AnimesRepositoryStub'
import { MoviesRepositoryStub } from '../helpers/mocks/data/repositories/MoviesRepositoryStub'
import { SeriesRepositoryStub } from '../helpers/mocks/data/repositories/SeriesRepositoryStub'

const makeSut = async () => {
  const moviesApi = new MoviesApiStub()
  const seriesApi = new SeriesApiStub()
  const animesApi = new AnimesApiStub()
  const statusApi = new StatusApiStub()
  const apiClients = { statusApi, moviesApi, seriesApi, animesApi }

  const slugger = new Slugger()

  const moviesRepository = new MoviesRepositoryStub()
  const seriesRepository = new SeriesRepositoryStub()
  const animesRepository = new AnimesRepositoryStub()
  const repositories = {
    moviesRepository,
    seriesRepository,
    animesRepository,
  }

  const popcornMoviesAdapter = new PopcornMoviesAdapter()
  const popcornSeriesAdapter = new PopcornSeriesAdapter()
  const popcornAnimesAdapter = new PopcornAnimesAdapter()
  const adapters = {
    popcornMoviesAdapter,
    popcornSeriesAdapter,
    popcornAnimesAdapter,
  }

  const storageStub = {
    data: undefined as unknown,
    saveData(key: string, data: unknown): Promise<void> {
      this.data = data
      return Promise.resolve()
    },
    getData(): Promise<unknown> {
      if (this.data) {
        return Promise.resolve(this.data)
      }
      return Promise.resolve(undefined)
    },
  }

  const crawlerConfig = {
    apiClients,
    slugger,
    repositories,
    adapters,
    storageManager: storageStub,
  }

  const crawler = await Crawler.CreateAsync(crawlerConfig)
  return {
    crawler,
    config: crawlerConfig,
  }
}

describe('Crawler', () => {
  describe('crawling preparations', () => {
    it('should save last API status with Storage Manager', async () => {
      const { crawler, config } = await makeSut()
      const saveData = jest.spyOn(config.storageManager, 'saveData')
      await crawler.start()
      const status = await config.apiClients.statusApi.getStatus()
      expect(saveData).toHaveBeenCalledWith('apiStatus.json', status)
    })

    it('retrieves last saved API status upon creation', async () => {
      const { config } = await makeSut()
      const getData = jest.spyOn(config.storageManager, 'getData')
      await Crawler.CreateAsync(config)
      expect(getData).toHaveBeenCalledTimes(1)
    })

    it('should getStatus from StatusApi client', async () => {
      const { crawler, config } = await makeSut()
      const getStatus = jest.spyOn(config.apiClients.statusApi, 'getStatus')
      await crawler.start()
      expect(getStatus).toHaveBeenCalled()
    })

    describe('notifying', () => {
      it('should notify observers if stopped with Reason "ApiNotIdle"', async () => {
        const { crawler, config } = await makeSut()
        const stopEvent = CrawlerEvents.Stop
        const { ApiNotIdle } = CrawlerEventReasons
        const subscriber = jest.fn()
        crawler.subscribe(stopEvent, subscriber)
        expect(subscriber).not.toBeCalled()

        config.apiClients.statusApi.simulateNotIdle()
        await crawler.start()
        expect(subscriber).toBeCalledTimes(1)
        expect(subscriber).toBeCalledWith(ApiNotIdle)
      })

      it('should notify observers if stopped with Reason "ApiNotUpdated"', async () => {
        const { crawler } = await makeSut()
        const stopEvent = CrawlerEvents.Stop
        const { ApiNotUpdated } = CrawlerEventReasons
        const subscriber = jest.fn()
        crawler.subscribe(stopEvent, subscriber)

        await crawler.start()
        expect(subscriber).not.toBeCalledWith(ApiNotUpdated)

        crawler.stop()
        await crawler.start()
        expect(subscriber).toBeCalledWith(ApiNotUpdated)
      })

      it('should notify observers when completed a crawl successfully', async () => {
        const { crawler } = await makeSut()
        const stopEvent = CrawlerEvents.Stop
        const { CrawlingFinished } = CrawlerEventReasons

        const subscriber = jest.fn()
        crawler.subscribe(stopEvent, subscriber)
        await crawler.start()
        expect(subscriber).toBeCalledWith(CrawlingFinished)
      })
    })

    describe('crawling', () => {
      describe('movies', () => {
        it('should get pages from MoviesApi', async () => {
          const { crawler, config } = await makeSut()
          const getPages = jest.spyOn(config.apiClients.moviesApi, 'getPages')
          await crawler.start()
          expect(getPages).toBeCalled()
        })

        it('should get movies for each page', async () => {
          const { crawler, config } = await makeSut()
          const getByPage = jest.spyOn(config.apiClients.moviesApi, 'getByPage')
          await crawler.start()
          expect(getByPage).toBeCalledTimes(
            config.apiClients.moviesApi.pages.length
          )
        })

        it('should adapt all movies from PopcornMovie to Movie model', async () => {
          const { crawler, config } = await makeSut()
          const adaptSeries = jest.spyOn(
            config.adapters.popcornSeriesAdapter,
            'adaptSeries'
          )
          await crawler.start()
          expect(adaptSeries).toBeCalled()
        })

        it('should slug movies after retrieving them', async () => {
          const { crawler, config } = await makeSut()
          const slug = jest.spyOn(config.slugger, 'slug')
          await crawler.start()
          expect(slug).toBeCalled()
        })

        it('should slug movies with ID if there are repeated slugs in database', async () => {
          const { crawler, config } = await makeSut()
          config.repositories.moviesRepository.moviesPool.push({
            _id: 'tt0118661',
            slug: config.slugger.slug('The Avengers'),
            title: 'The Avengers',
          })
          const slugWithId = jest.spyOn(config.slugger, 'slugWithId')
          await crawler.start()
          expect(slugWithId).toBeCalledWith('The Avengers', 'tt0848228')
        })

        it('should save adapted, new movies into the repository', async () => {
          const { crawler, config } = await makeSut()
          const saveMany = jest.spyOn(
            config.repositories.moviesRepository,
            'saveMany'
          )
          await crawler.start()
          expect(saveMany).toBeCalled()
          expect(config.repositories.moviesRepository.moviesPool).toHaveLength(
            config.apiClients.moviesApi.popcornMovies.length
          )
        })

        it('should save only movies that are new to database', async () => {
          const { crawler, config } = await makeSut()
          const newMovies = config.repositories.moviesRepository.simulatePreviousCrawlAndReturnUnsavedMovies()
          const saveMany = jest.spyOn(
            config.repositories.moviesRepository,
            'saveMany'
          )
          await crawler.start()
          expect(saveMany).toBeCalledWith(newMovies)
        })
      })

      describe('series', () => {
        it('should get pages from SeriesApi', async () => {
          const { crawler, config } = await makeSut()
          const getPages = jest.spyOn(config.apiClients.seriesApi, 'getPages')
          await crawler.start()
          expect(getPages).toBeCalled()
        })

        it('should get series for each page', async () => {
          const { crawler, config } = await makeSut()
          const getByPage = jest.spyOn(config.apiClients.seriesApi, 'getByPage')
          await crawler.start()
          expect(getByPage).toBeCalledTimes(
            config.apiClients.seriesApi.pages.length
          )
        })

        it('should adapt all series from PopcornShow to Series model', async () => {
          const { crawler, config } = await makeSut()
          const adaptMovies = jest.spyOn(
            config.adapters.popcornSeriesAdapter,
            'adaptSeries'
          )
          await crawler.start()
          expect(adaptMovies).toBeCalled()
        })

        it('should save adapted, new series into the repository', async () => {
          const { crawler, config } = await makeSut()
          const saveMany = jest.spyOn(
            config.repositories.seriesRepository,
            'saveMany'
          )
          await crawler.start()
          expect(saveMany).toBeCalled()
          expect(config.repositories.seriesRepository.seriesPool).toHaveLength(
            config.apiClients.seriesApi.popcornShows.length
          )
        })

        it('should save only series that are new to database', async () => {
          const { crawler, config } = await makeSut()
          const newMovies = config.repositories.seriesRepository.simulatePreviousCrawlAndReturnUnsavedSeries()
          const saveMany = jest.spyOn(
            config.repositories.seriesRepository,
            'saveMany'
          )
          await crawler.start()
          expect(saveMany).toBeCalledWith(newMovies)
        })
      })

      describe('animes', () => {
        it('should get pages from AnimesApi', async () => {
          const { crawler, config } = await makeSut()
          const getPages = jest.spyOn(config.apiClients.animesApi, 'getPages')
          await crawler.start()
          expect(getPages).toBeCalled()
        })

        it('should get animes for each page', async () => {
          const { crawler, config } = await makeSut()
          const getByPage = jest.spyOn(config.apiClients.animesApi, 'getByPage')
          await crawler.start()
          expect(getByPage).toBeCalledTimes(
            config.apiClients.animesApi.pages.length
          )
        })

        it('should adapt all animes from PopcornAnime to Animes model', async () => {
          const { crawler, config } = await makeSut()
          const adaptAnimes = jest.spyOn(
            config.adapters.popcornAnimesAdapter,
            'adaptAnimes'
          )
          await crawler.start()
          expect(adaptAnimes).toBeCalled()
        })

        it('should save adapted, new animes into the repository', async () => {
          const { crawler, config } = await makeSut()
          const saveMany = jest.spyOn(
            config.repositories.animesRepository,
            'saveMany'
          )
          await crawler.start()
          expect(saveMany).toBeCalled()
          expect(config.repositories.animesRepository.animesPool).toHaveLength(
            config.apiClients.animesApi.popcornAnimes.length
          )
        })

        it('should save only animes that are new to database', async () => {
          const { crawler, config } = await makeSut()
          const newAnimes = config.repositories.animesRepository.simulatePreviousCrawlAndReturnUnsavedAnimes()
          const saveMany = jest.spyOn(
            config.repositories.animesRepository,
            'saveMany'
          )
          await crawler.start()
          expect(saveMany).toBeCalledWith(newAnimes)
        })
      })
    })
  })
})
