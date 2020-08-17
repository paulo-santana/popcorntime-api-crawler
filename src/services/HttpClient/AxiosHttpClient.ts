import Axios, { AxiosInstance } from 'axios'
import { IHttpClient } from './IHttpClient'

export class AxiosHttpClient implements IHttpClient {
  axios: AxiosInstance

  constructor(baseURL: string) {
    this.axios = Axios.create({ baseURL })
  }

  async get(uri: string): Promise<string> {
    const response = await this.axios.get(uri)
    return JSON.stringify(response.data)
  }
}
