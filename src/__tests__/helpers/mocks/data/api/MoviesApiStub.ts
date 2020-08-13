import { PopcornApiStatus, IMoviesApi } from '@/data/api'
import { PopcornMovie } from '@/services/popcornTimeTypes'
import { apiStatusStub, apiResources } from '../../mocks'

const { movies } = apiResources

export class MoviesApiStub implements IMoviesApi {
  pages = ['movies/1', 'movies/2', 'movies/3']
  popcornMovies: PopcornMovie[] = new Array<PopcornMovie>().concat(
    ...movies['movies/1'],
    ...movies['movies/2'],
    ...movies['movies/3']
  )
  getStatus(): Promise<PopcornApiStatus> {
    const statusStub: PopcornApiStatus = apiStatusStub
    return new Promise(resolve => resolve(statusStub))
  }

  getPages(): Promise<string[]> {
    return new Promise(resolve => resolve(this.pages))
  }

  getByPage(
    page: 'movies/1' | 'movies/2' | 'movies/3'
  ): Promise<PopcornMovie[]> {
    const response = movies[page]
    return new Promise(resolve => resolve(response))
  }

  getById(id: string): Promise<PopcornMovie> {
    const foundMovie = this.popcornMovies.find(movie => movie._id === id)
    return new Promise(resolve => resolve(foundMovie))
  }
}
