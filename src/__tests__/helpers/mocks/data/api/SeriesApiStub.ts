import { IPopcornTimeResourcesApi } from '@/data/api'
import { PopcornShow } from '@/services/popcornTimeTypes'
import { apiResources } from '../../mocks'

const { shows } = apiResources

export class SeriesApiStub implements IPopcornTimeResourcesApi {
  pages = ['shows/1', 'shows/2']
  popcornShows: PopcornShow[] = new Array<PopcornShow>().concat(
    ...shows['shows/1'],
    ...shows['shows/2']
  )

  getPages(): Promise<string[]> {
    return new Promise(resolve => resolve(this.pages))
  }

  getByPage(page: 'shows/1' | 'shows/2'): Promise<PopcornShow[]> {
    const response = shows[page]
    return new Promise(resolve => resolve(response))
  }

  getById(id: string): Promise<PopcornShow> {
    const foundShow = this.popcornShows.find(show => show._id === id)
    return new Promise(resolve => resolve(foundShow))
  }
}
