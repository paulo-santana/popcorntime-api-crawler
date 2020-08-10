import { Crawler, CrawlerStatus } from '@/app/crawler'

import { Slugger } from '@/utils'
import { MovieRepository } from '@/data/repositories'
import PopcornMovieAdapter from '@/data/helpers/PopcornMovieAdapter'
import { MoviesApiStub } from '../helpers/mocks/MoviesApiStub'
import { SeriesApiStub } from '../helpers/mocks/SeriesApiStub'
import { AnimesApiStub } from '../helpers/mocks/AnimesApiStub'

const makeSut = () => {
  const moviesApi = new MoviesApiStub()
  const seriesApi = new SeriesApiStub()
  const animesApi = new AnimesApiStub()

  const apiClients = { moviesApi, seriesApi, animesApi }

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
  })
})
