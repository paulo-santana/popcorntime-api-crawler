import { PopcornApiStatus } from './IPopcornTimeResourcesApi'

export interface IPopcornTimeStatusApi {
  getStatus(): Promise<PopcornApiStatus>
}
