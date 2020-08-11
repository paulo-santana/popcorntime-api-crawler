import { PopcornApiStatus } from './IPopcornTimeApi'

export interface IPopcornTimeStatusApi {
  getStatus(): Promise<PopcornApiStatus>
}
