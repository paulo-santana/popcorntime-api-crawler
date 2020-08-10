import { PopcornMovie } from '@/services/popcornTimeTypes'
import { Movie } from '../models/Movie'

export default class PopcornMovieAdapter {
  adaptMovies(popcornMovies: PopcornMovie[]): Movie[] {
    const movies = popcornMovies.map(popcornMovie => {
      const movie: Movie = {
        _id: popcornMovie._id,
        title: popcornMovie.title,
      }
      return movie
    })
    return movies
  }
}
