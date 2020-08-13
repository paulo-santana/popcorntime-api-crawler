import { IHttpClient } from '@/services/HttpClient'
import { apiResources, animesPages } from './mocks/mocks'

const responsesForUris = {
  animes: animesPages.map(v => v),
  'animes/1': apiResources.animes['animes/1'],
  'animes/2': apiResources.animes['animes/2'],
}

const makeHttpClient = (): IHttpClient => {
  const httpClient: IHttpClient = {
    get(uri: 'animes' | 'animes/1' | 'animes/2'): Promise<string> {
      const response = responsesForUris[uri]
      return new Promise(resolve => resolve(JSON.stringify(response)))
    },
  }
  return httpClient
}
export default makeHttpClient
