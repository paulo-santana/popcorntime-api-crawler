import { IHttpClient } from '@/services/HttpClient'
import { PopcornMovie } from '@/services/popcornTimeTypes'
import { IMoviesApi } from './IPopcornTimeResourcesApi'

export class MoviesApi implements IMoviesApi {
  private client: IHttpClient

  constructor(client: IHttpClient) {
    this.client = client
  }

  async getPages(): Promise<Array<string>> {
    const response = await this.client.get(`movies`)
    const pages = JSON.parse(response)
    return pages
  }

  async getByPage(page: string): Promise<Array<PopcornMovie>> {
    const response = await this.client.get(page)
    const responseArray = JSON.parse(response)
    return responseArray
  }
}
