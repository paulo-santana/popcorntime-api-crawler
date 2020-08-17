import { IHttpClient } from '@/services/HttpClient'
import { PopcornApiStatus } from './IPopcornTimeResourcesApi'

export interface IPopcornTimeStatusApi {
  getStatus(): Promise<PopcornApiStatus>
}

export class StatusApi implements IPopcornTimeStatusApi {
  private client: IHttpClient

  constructor(client: IHttpClient) {
    this.client = client
  }

  async getStatus(): Promise<PopcornApiStatus> {
    const response = await this.client.get('status')
    const status = JSON.parse(response)
    return status
  }
}
