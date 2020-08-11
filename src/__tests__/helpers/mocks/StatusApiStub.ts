import { PopcornApiStatus } from '@/services'
import { apiStatusStub } from './mocks'

export class StatusApiStub {
  getStatus(): Promise<PopcornApiStatus> {
    return new Promise(resolve => resolve(apiStatusStub))
  }
  simulateUpdate(): void {
    jest
      .spyOn(StatusApiStub.prototype, 'getStatus')
      .mockImplementationOnce(async () => ({
        ...apiStatusStub,
        updated: apiStatusStub.updated + 1,
      }))
  }
}
