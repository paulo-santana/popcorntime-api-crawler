import { IPopcornTimeApi, PopcornApiStatus } from '@/services'
import { PopcornShow } from '@/services/popcornTimeTypes'
import { apiStatusStub } from './mocks'
import apiResources from './apiResources'

export const pages = ['shows/1', 'shows/2']

export class SeriesApiStub implements IPopcornTimeApi {
  getStatus(): Promise<PopcornApiStatus> {
    const statusStub: PopcornApiStatus = apiStatusStub
    return new Promise(resolve => resolve(statusStub))
  }

  getPages(): Promise<string[]> {
    return new Promise(resolve => resolve(pages))
  }

  getByPage(page: 'shows/1' | 'shows/2'): Promise<PopcornShow[]> {
    const response = apiResources[page]
    return new Promise(resolve => resolve(response))
  }

  getById(id: string): Promise<PopcornShow> {
    const shows = apiResources['shows/1']
    shows.concat(...apiResources['shows/2'])
    const foundShow = shows.find(show => show._id === id)
    return new Promise(resolve => resolve(foundShow))
  }
}
