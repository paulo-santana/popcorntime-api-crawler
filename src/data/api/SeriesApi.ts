import { IPopcornTimeApi, PopcornApiStatus } from '@/services'
import { IHttpClient } from '@/services/HttpClient'
import { PopcornShow } from '@/services/popcornTimeTypes'

// eslint-disable-next-line import/prefer-default-export
export class SeriesApi implements IPopcornTimeApi {
  private client: IHttpClient

  constructor(client: IHttpClient) {
    this.client = client
  }

  async getStatus(): Promise<PopcornApiStatus> {
    const response = await this.client.get('/status')
    const status: PopcornApiStatus = JSON.parse(response)
    return status
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

  async getById(id: string): Promise<PopcornShow> {
    const response = await this.client.get(`show/${id}`)
    const responseObject: PopcornShow = JSON.parse(response)
    return responseObject
  }
}
