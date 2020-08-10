/* eslint-disable camelcase */
import { PopcornResource } from '.'

export interface PopcornAnime extends PopcornResource {
  mal_id: string
  slug: string
  type: string
  genres: string[]
  num_seasons: number
}
