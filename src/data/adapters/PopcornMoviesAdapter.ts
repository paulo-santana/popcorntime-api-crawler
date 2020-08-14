import { PopcornMovie } from '@/services/popcornTimeTypes'
import { Movie } from '../models/Movie'

export class PopcornMoviesAdapter {
  adaptMovies(popcornMovies: PopcornMovie[]): Movie[] {
    const movies = popcornMovies.map(popcornMovie => {
      return {
        _id: popcornMovie._id,
        title: popcornMovie.title,
        slug: '',
      }
    })
    return movies
  }
}
