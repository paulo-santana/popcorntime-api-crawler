import { IHttpClient } from '@/services/HttpClient'
import { PopcornAnime } from '@/services/popcornTimeTypes'
import { IAnimesApi } from './IPopcornTimeResourcesApi'

// eslint-disable-next-line import/prefer-default-export
export class AnimesApi implements IAnimesApi {
  private client: IHttpClient

  constructor(client: IHttpClient) {
    this.client = client
  }

  async getPages(): Promise<Array<string>> {
    const response = await this.client.get('animes')
    const pages = JSON.parse(response)
    return pages
  }

  async getByPage(page: string): Promise<Array<PopcornAnime>> {
    const response = await this.client.get(page)
    const responseArray = JSON.parse(response)
    return responseArray
  }
}
