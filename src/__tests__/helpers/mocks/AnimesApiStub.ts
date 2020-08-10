import { IPopcornTimeApi, PopcornApiStatus } from '@/services'
import { PopcornAnime } from '@/services/popcornTimeTypes'
import { apiStatusStub } from './mocks'
import apiResources from './apiResources'

export const pages = ['animes/1', 'animes/2']

export class AnimesApiStub implements IPopcornTimeApi {
  getStatus(): Promise<PopcornApiStatus> {
    const statusStub: PopcornApiStatus = apiStatusStub
    return new Promise(resolve => resolve(statusStub))
  }

  getPages(): Promise<string[]> {
    return new Promise(resolve => resolve(pages))
  }

  getByPage(page: 'animes/1' | 'animes/2'): Promise<PopcornAnime[]> {
    const response = apiResources[page]
    return new Promise(resolve => resolve(response))
  }

  getById(id: string): Promise<PopcornAnime> {
    const animes = apiResources['animes/1']
    animes.concat(...apiResources['animes/2'])
    const foundAnime = animes.find(anime => anime._id === id)
    return new Promise(resolve => resolve(foundAnime))
  }
}
