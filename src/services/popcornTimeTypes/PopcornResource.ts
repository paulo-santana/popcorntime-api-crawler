/* eslint-disable camelcase */
export interface PopcornResource {
  _id: string
  title: string
  year: string
  synopsis?: string
  images: {
    poster: string
    fanart: string
    banner: string
  }
  rating: {
    percentage: number
    watching: number
    votes: number
    loved: number
    hated: number
  }
}
