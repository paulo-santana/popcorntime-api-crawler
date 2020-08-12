import { PopcornAnime } from '@/services/popcornTimeTypes'
import { Anime } from '../models/Anime'

export default class PopcornAnimeAdapter {
  adaptAnimes(popcornShows: PopcornAnime[]): Anime[] {
    const series = popcornShows.map(popcornShow => {
      const serie: Anime = {
        _id: popcornShow._id,
        title: popcornShow.title,
        slug: popcornShow.slug,
      }
      return serie
    })
    return series
  }
}
