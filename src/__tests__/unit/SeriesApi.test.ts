import { SeriesApi } from '@/data/api'
import makeHttpClient from '../helpers/httpClientFactory'
import { apiResources } from '../helpers/mocks/mocks'

const makeSut = () => {
  const httpClient = makeHttpClient()
  const seriesApi = new SeriesApi(httpClient)
  return { seriesApi }
}

describe('SeriesApi consumer', () => {
  it('should fetch and parse pages correctly', async () => {
    const { seriesApi } = makeSut()
    const pages = await seriesApi.getPages()
    expect(pages).toEqual(['shows/1', 'shows/2'])
  })

  it('should get series for each page', async () => {
    const { seriesApi } = makeSut()
    const firstPage = await seriesApi.getByPage('shows/1')
    expect(firstPage).toEqual(apiResources.shows['shows/1'])
    const secondPage = await seriesApi.getByPage('shows/2')
    expect(secondPage).toEqual(apiResources.shows['shows/2'])
    const emptyPage = await seriesApi.getByPage('shows/3')
    expect(emptyPage).toEqual([])
  })
})
