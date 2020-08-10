import { IHttpClient } from '@/services/HttpClient'

const makeHttpClient = (): IHttpClient => {
  const httpClient: IHttpClient = {
    get(uri: string): Promise<string> {
      return new Promise(resolve => resolve(uri))
    },
  }
  return httpClient
}
export default makeHttpClient
