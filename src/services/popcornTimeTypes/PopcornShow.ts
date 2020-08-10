/* eslint-disable camelcase */
import { PopcornResource } from '.'

export interface PopcornShow extends PopcornResource {
  imdb_id: string
  tvdb_id: string
  slug: string
  num_seasons: number
}
