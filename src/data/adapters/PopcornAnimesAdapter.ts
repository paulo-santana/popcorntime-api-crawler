import { PopcornAnime } from '@/services/popcornTimeTypes'
import { Anime } from '../models/Anime'

export class PopcornAnimesAdapter {
  adaptAnimes(popcornAnimes: PopcornAnime[]): Anime[] {
    const animes = popcornAnimes.map(popcornShow => {
      return {
        _id: popcornShow._id,
        title: popcornShow.title,
        slug: popcornShow.slug,
      }
    })
    return animes
  }
}
