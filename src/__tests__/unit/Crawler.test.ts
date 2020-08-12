import {
  Crawler,
  CrawlerStatus,
  CrawlerEvents,
  CrawlerEventReasons,
} from '@/app/crawler'

import { Slugger } from '@/utils'
import PopcornMovieAdapter from '@/data/helpers/PopcornMovieAdapter'
import PopcornSerieAdapter from '@/data/helpers/PopcornSerieAdapter'
import { MoviesApiStub } from '../helpers/mocks/MoviesApiStub'
import { SeriesApiStub } from '../helpers/mocks/SeriesApiStub'
import { AnimesApiStub } from '../helpers/mocks/AnimesApiStub'
import { StatusApiStub } from '../helpers/mocks/StatusApiStub'
import { MovieRepositoryStub } from '../helpers/mocks/data/MovieRepositoryStub'
import { SeriesRepositoryStub } from '../helpers/mocks/data/SeriesRepositoryStub'

const makeSut = () => {
  const moviesApi = new MoviesApiStub()
  const seriesApi = new SeriesApiStub()
  const animesApi = new AnimesApiStub()
  const statusApi = new StatusApiStub()

  const apiClients = { statusApi, moviesApi, seriesApi, animesApi }

  const slugger = new Slugger()
  const movieRepository = new MovieRepositoryStub()
  const seriesRepository = new SeriesRepositoryStub()
  const repositories = { movieRepository, seriesRepository }

  const popcornMovieAdapter = new PopcornMovieAdapter()
  const popcornSerieAdapter = new PopcornSerieAdapter()

  const adapters = { popcornMovieAdapter, popcornSerieAdapter }

  const crawlerConfig = {
    apiClients,
    slugger,
    repositories,
    adapters,
  }

  return {
    crawler: new Crawler(crawlerConfig),
    config: crawlerConfig,
  }
}

describe('Crawler', () => {
  describe('creation', () => {
    it('should have status "IDLE" upon creation', () => {
      const { crawler } = makeSut()
      expect(crawler.status).toBe(CrawlerStatus.Idle)
    })

    it('should have status "CRAWLING" after start() has been called', async () => {
      const { crawler } = makeSut()
      await crawler.start()
      expect(crawler.status).toBe(CrawlerStatus.Crawling)
    })

    it('should not crawl if there was no update on API since last crawl', async () => {
      const { crawler } = makeSut()
      await crawler.start()
      crawler.stop()
      await crawler.start()
      expect(crawler.status).not.toBe(CrawlerStatus.Crawling)
    })

    it('should crawl if there is an update on API', async () => {
      const { crawler, config } = makeSut()
      await crawler.start()
      crawler.stop()
      config.apiClients.statusApi.simulateUpdate()
      await crawler.start()
      expect(crawler.status).toBe(CrawlerStatus.Crawling)
    })

    it('should getStatus from StatusApi client', async () => {
      const { crawler, config } = makeSut()
      const getStatus = jest.spyOn(config.apiClients.statusApi, 'getStatus')
      await crawler.start()
      expect(getStatus).toHaveBeenCalled()
    })

    it('must not start crawling if API is not "Idle"', async () => {
      const { crawler, config } = makeSut()
      config.apiClients.statusApi.simulateNotIdle()
      await crawler.start()
      expect(crawler.status).not.toBe(CrawlerStatus.Crawling)
    })
  })

  describe('notifying', () => {
    it('should notify observers if stoped with Reason "APINotIdle"', async () => {
      const { crawler, config } = makeSut()
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
  })

  describe('crawling', () => {
    describe('movies', () => {
      it('should get pages from MoviesApi', async () => {
        const { crawler, config } = makeSut()
        const getPages = jest.spyOn(config.apiClients.moviesApi, 'getPages')
        await crawler.start()
        expect(getPages).toBeCalled()
      })

      it('should get movies for each page', async () => {
        const { crawler, config } = makeSut()
        const getByPage = jest.spyOn(config.apiClients.moviesApi, 'getByPage')
        await crawler.start()
        expect(getByPage).toBeCalledTimes(
          config.apiClients.moviesApi.pages.length
        )
      })

      it('should adapt all movies from PopcornMovie to Movie model', async () => {
        const { crawler, config } = makeSut()
        const adaptSeries = jest.spyOn(
          config.adapters.popcornSerieAdapter,
          'adaptSeries'
        )
        await crawler.start()
        expect(adaptSeries).toBeCalled()
      })

      it('should slug movies after retrieving them', async () => {
        const { crawler, config } = makeSut()
        const slug = jest.spyOn(config.slugger, 'slug')
        await crawler.start()
        expect(slug).toBeCalled()
      })

      it('should save adapted, new movies into the repository', async () => {
        const { crawler, config } = makeSut()
        const saveMany = jest.spyOn(
          config.repositories.movieRepository,
          'saveMany'
        )
        await crawler.start()
        expect(saveMany).toBeCalled()
        expect(config.repositories.movieRepository.moviesPool).toHaveLength(
          config.apiClients.moviesApi.popcornMovies.length
        )
      })

      it('should save only movies that are new to database', async () => {
        const { crawler, config } = makeSut()
        const newMovies = config.repositories.movieRepository.simulatePreviousCralAndReturnUnsavedMovies()
        const saveMany = jest.spyOn(
          config.repositories.movieRepository,
          'saveMany'
        )
        await crawler.start()
        expect(saveMany).toBeCalledWith(newMovies)
      })
    })

    describe('series', () => {
      it('should get pages from SeriesApi', async () => {
        const { crawler, config } = makeSut()
        const getPages = jest.spyOn(config.apiClients.seriesApi, 'getPages')
        await crawler.start()
        expect(getPages).toBeCalled()
      })

      it('should get series for each page', async () => {
        const { crawler, config } = makeSut()
        const getByPage = jest.spyOn(config.apiClients.seriesApi, 'getByPage')
        await crawler.start()
        expect(getByPage).toBeCalledTimes(
          config.apiClients.seriesApi.pages.length
        )
      })

      it('should adapt all series from PopcornShow to Serie model', async () => {
        const { crawler, config } = makeSut()
        const adaptMovies = jest.spyOn(
          config.adapters.popcornSerieAdapter,
          'adaptSeries'
        )
        await crawler.start()
        expect(adaptMovies).toBeCalled()
      })

      it('should save adapted, new series into the repository', async () => {
        const { crawler, config } = makeSut()
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
        const { crawler, config } = makeSut()
        const newMovies = config.repositories.seriesRepository.simulatePreviousCralAndReturnUnsavedSeries()
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
        const { crawler, config } = makeSut()
        const getPages = jest.spyOn(config.apiClients.animesApi, 'getPages')
        await crawler.start()
        expect(getPages).toBeCalled()
      })
    })
  })
})
