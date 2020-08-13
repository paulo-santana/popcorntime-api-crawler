import { MoviesApi } from '@/data/api'
import makeHttpClient from '../helpers/httpClientFactory'
import { moviesPages, animesPages, apiResources } from '../helpers/mocks/mocks'

const makeSut = () => {
  const httpClient = makeHttpClient()
  const moviesApi = new MoviesApi(httpClient)
  return { moviesApi, httpClient }
}

describe('MoviesApi consumer', () => {
  it('should fetch and parse pages correctly', async () => {
    const { moviesApi } = makeSut()
    const pages = await moviesApi.getPages()
    expect(pages).toEqual(['movies/1', 'movies/2', 'movies/3'])
  })

  it('should get animes for each page', async () => {
    const { moviesApi } = makeSut()
    const firstPage = await moviesApi.getByPage('movies/1')
    expect(firstPage).toEqual(apiResources.movies['movies/1'])
    const secondPage = await moviesApi.getByPage('movies/2')
    expect(secondPage).toEqual(apiResources.movies['movies/2'])
    const thirdPage = await moviesApi.getByPage('movies/3')
    expect(thirdPage).toEqual(apiResources.movies['movies/3'])
    const emptyPage = await moviesApi.getByPage('movies/4')
    expect(emptyPage).toEqual([])
  })
})
