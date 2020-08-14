import { IHttpClient } from '@/services/HttpClient'
import {
  apiResources,
  animesPages,
  moviesPages,
  showsPages,
} from './mocks/mocks'

const responsesForUris = {
  animes: animesPages,
  'animes/1': apiResources.animes['animes/1'],
  'animes/2': apiResources.animes['animes/2'],
  'animes/3': [],
  movies: moviesPages,
  'movies/1': apiResources.movies['movies/1'],
  'movies/2': apiResources.movies['movies/2'],
  'movies/3': apiResources.movies['movies/3'],
  'movies/4': [],
  shows: showsPages,
  'shows/1': apiResources.shows['shows/1'],
  'shows/2': apiResources.shows['shows/2'],
  'shows/3': [],
}

type TestUris = 'animes' | 'animes/1' | 'animes/2' | 'animes/3' | 'movies'

const makeHttpClient = (): IHttpClient => {
  const httpClient: IHttpClient = {
    get(uri: TestUris): Promise<string> {
      const response = responsesForUris[uri]
      return new Promise(resolve => resolve(JSON.stringify(response)))
    },
  }
  return httpClient
}
export default makeHttpClient
