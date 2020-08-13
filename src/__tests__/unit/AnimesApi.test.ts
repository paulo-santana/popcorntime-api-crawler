import { AnimesApi } from '@/data/api'
import { apiResources } from '../helpers/mocks/mocks'
import makeHttpClient from '../helpers/httpClientFactory'

const makeSut = () => {
  const httpClient = makeHttpClient()
  const animesApi = new AnimesApi(httpClient)
  return { animesApi, httpClient }
}

describe('AnimesApiAccess', () => {
  it('should fetch and parse pages correctly', async () => {
    const { animesApi, httpClient } = makeSut()
    jest.spyOn(httpClient, 'get').mockImplementationOnce(() => {
      return new Promise(resolve =>
        resolve(JSON.stringify(['animes/1', 'animes/2']))
      )
    })
    const pages = await animesApi.getPages()
    expect(pages).toEqual(['animes/1', 'animes/2'])
  })

  it('should be able to get animes for each page', async () => {
    const { animesApi } = makeSut()
    const firstPage = await animesApi.getByPage('animes/1')
    expect(firstPage).toEqual(apiResources.animes['animes/1'])

    const secondPage = await animesApi.getByPage('animes/2')
    expect(secondPage).toEqual(apiResources.animes['animes/2'])

    const emptyPage = await animesApi.getByPage('animes/3')
    expect(emptyPage).toEqual([])
  })
})
