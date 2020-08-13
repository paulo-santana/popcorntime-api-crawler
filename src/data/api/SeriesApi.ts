import { IHttpClient } from '@/services/HttpClient'
import { PopcornShow } from '@/services/popcornTimeTypes'
import { ISeriesApi } from './IPopcornTimeResourcesApi'

export class SeriesApi implements ISeriesApi {
  private client: IHttpClient

  constructor(client: IHttpClient) {
    this.client = client
  }

  async getPages(): Promise<Array<string>> {
    const response = await this.client.get(`shows`)
    const pages = JSON.parse(response)
    return pages
  }

  async getByPage(page: string): Promise<Array<PopcornShow>> {
    const response = await this.client.get(page)
    const responseArray = JSON.parse(response)
    return responseArray
  }
}
