import { IPopcornTimeResourcesApi } from '@/data/api'
import { PopcornAnime } from '@/services/popcornTimeTypes'
import { apiResources } from '../../mocks'

const { animes } = apiResources

export class AnimesApiStub implements IPopcornTimeResourcesApi {
  pages = ['animes/1', 'animes/2']
  popcornAnimes: PopcornAnime[] = new Array<PopcornAnime>().concat(
    ...animes['animes/1'],
    ...animes['animes/2']
  )

  getPages(): Promise<string[]> {
    return new Promise(resolve => resolve(this.pages))
  }

  getByPage(page: 'animes/1' | 'animes/2'): Promise<PopcornAnime[]> {
    const response = animes[page]
    return new Promise(resolve => resolve(response))
  }

  getById(id: string): Promise<PopcornAnime> {
    const foundAnime = this.popcornAnimes.find(anime => anime._id === id)
    return new Promise(resolve => resolve(foundAnime))
  }
}
