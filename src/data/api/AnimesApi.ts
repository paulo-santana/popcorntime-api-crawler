import { IPopcornTimeApi, PopcornApiStatus } from '@/services'
import { IHttpClient } from '@/services/HttpClient'
import { PopcornAnime } from '@/services/popcornTimeTypes'

// eslint-disable-next-line import/prefer-default-export
export class AnimesApi implements IPopcornTimeApi {
  private client: IHttpClient

  constructor(private readonly media: string, client: IHttpClient) {
    this.client = client
  }

  async getStatus(): Promise<PopcornApiStatus> {
    const response = await this.client.get('/status')
    const status: PopcornApiStatus = JSON.parse(response)
    return status
  }

  async getPages(): Promise<Array<string>> {
    const response = await this.client.get('/animes')
    const pages = JSON.parse(response)
    return pages
  }

  async getByPage(page: string): Promise<Array<PopcornAnime>> {
    const response = await this.client.get(page)
    const responseArray = JSON.parse(response)
    return responseArray
  }

  async getById(id: string): Promise<PopcornAnime> {
    const response = await this.client.get(`anime/${id}`)
    const responseObject: PopcornAnime = JSON.parse(response)
    return responseObject
  }
}
