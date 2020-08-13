import { PopcornShow } from '@/services/popcornTimeTypes'
import { Series } from '../models/Series'

export class PopcornSeriesAdapter {
  adaptSeries(popcornShows: PopcornShow[]): Series[] {
    const series = popcornShows.map(popcornShow => {
      return {
        _id: popcornShow._id,
        title: popcornShow.title,
        slug: popcornShow.slug,
      }
    })
    return series
  }
}
