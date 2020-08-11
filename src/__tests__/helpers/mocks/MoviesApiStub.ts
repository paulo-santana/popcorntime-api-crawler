import { PopcornApiStatus, IMoviesApi } from '@/services'
import { PopcornMovie } from '@/services/popcornTimeTypes'
import { apiStatusStub } from './mocks'
import apiResources from './apiResources'

export class MoviesApiStub implements IMoviesApi {
  pages = ['movies/1', 'movies/2', 'movies/3']

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
    const response = apiResources[page]
    return new Promise(resolve => resolve(response))
  }

  getById(id: string): Promise<PopcornMovie> {
    const movies = apiResources['movies/1']
    movies.concat(...apiResources['movies/2'], ...apiResources['movies/3'])
    const foundMovie = movies.find(movie => movie._id === id)
    return new Promise(resolve => resolve(foundMovie))
  }
}
