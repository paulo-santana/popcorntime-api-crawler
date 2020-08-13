import { AnimesApi } from '@/data/api'
import makeHttpClient from '../helpers/httpClientFactory'

describe('AnimesApiAccess', () => {
  it('should fetch and parse pages correctly', async () => {
    const httpClient = makeHttpClient()
    const animesApi = new AnimesApi(httpClient)
    jest.spyOn(httpClient, 'get').mockImplementationOnce(() => {
      return new Promise(resolve =>
        resolve(JSON.stringify(['animes/1', 'animes/2']))
      )
    })
    const pages = await animesApi.getPages()
    expect(pages).toEqual(['animes/1', 'animes/2'])
  })
})
