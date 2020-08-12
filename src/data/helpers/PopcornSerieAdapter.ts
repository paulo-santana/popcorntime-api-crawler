import { PopcornShow } from '@/services/popcornTimeTypes'
import { Serie } from '../models/Serie'

export default class PopcornSerieAdapter {
  adaptSeries(popcornShows: PopcornShow[]): Serie[] {
    const series = popcornShows.map(popcornShow => {
      const serie: Serie = {
        _id: popcornShow._id,
        title: popcornShow.title,
        slug: popcornShow.slug,
      }
      return serie
    })
    return series
  }
}
