import { IHttpClient } from '@/services/HttpClient'
import { PopcornMovie } from '@/services/popcornTimeTypes'
import { IPopcornTimeResourcesApi } from '.'

export class MoviesApi implements IPopcornTimeResourcesApi {
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

  async getById(id: string): Promise<PopcornMovie> {
    const response = await this.client.get(`movie/${id}`)
    const responseObject: PopcornMovie = JSON.parse(response)
    return responseObject
  }
}
