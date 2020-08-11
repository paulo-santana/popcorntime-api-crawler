import Axios, { AxiosInstance } from 'axios'
import { IHttpClient } from './IHttpClient'

// eslint-disable-next-line import/prefer-default-export
export class AxiosHttpClient implements IHttpClient {
  axios: AxiosInstance

  constructor(baseURL: string) {
    this.axios = Axios.create({ baseURL })
  }

  async get(uri: string): Promise<string> {
    const response = await this.axios.get(uri, { responseType: 'text' })
    return response.data
  }
}