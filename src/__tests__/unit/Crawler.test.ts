import { Crawler, CrawlerStatus } from '@/app/crawler'

import { Slugger } from '@/utils'
import { MovieRepository } from '@/data/repositories'
import PopcornMovieAdapter from '@/data/helpers/PopcornMovieAdapter'
import { PopcornApiStatus } from '@/services'
import { MoviesApiStub } from '../helpers/mocks/MoviesApiStub'
import { SeriesApiStub } from '../helpers/mocks/SeriesApiStub'
import { AnimesApiStub } from '../helpers/mocks/AnimesApiStub'
import { apiStatusStub } from '../helpers/mocks/mocks'

const makeSut = () => {
  class StatusApiStub {
    getStatus(): Promise<PopcornApiStatus> {
      return new Promise(resolve => resolve(apiStatusStub))
    }
    simulateUpdate(): void {
      jest
        .spyOn(StatusApiStub.prototype, 'getStatus')
        .mockImplementationOnce(async () => ({
          ...apiStatusStub,
          updated: apiStatusStub.updated + 1,
        }))
    }
  }

  const moviesApi = new MoviesApiStub()
  const seriesApi = new SeriesApiStub()
  const animesApi = new AnimesApiStub()
  const statusApi = new StatusApiStub()

  const apiClients = { statusApi, moviesApi, seriesApi, animesApi }

  const slugger = new Slugger()
  const movieRepository = new MovieRepository()
  const popcornMovieAdapter = new PopcornMovieAdapter()

  const crawlerConfig = {
    apiClients,
    slugger,
    movieRepository,
    popcornMovieAdapter,
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

    it('should have status "CRAWLING" after start() has been called', () => {
      const { crawler } = makeSut()
      crawler.start()
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

    it('should getStatus from StatusApi client', () => {
      const { crawler, config } = makeSut()
      const getStatus = jest.spyOn(config.apiClients.statusApi, 'getStatus')
      crawler.start()
      expect(getStatus).toHaveBeenCalled()
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
    })
  })
})
