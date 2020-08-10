/* eslint-disable camelcase */
import { PopcornResource } from '.'

export interface PopcornMovie extends PopcornResource {
  imdb_id: string
  runtime: string
  released: number
  trailer: string
  certification: string
  torrents?: {
    en: {
      '2160p'?: {
        provider: string
        filesize: string
        size: number
        peer: number
        seed: number
        url: string
      }
      '1080p'?: {
        provider: string
        filesize: string
        size: number
        peer: number
        seed: number
        url: string
      }
      '720p'?: {
        provider: string
        filesize: string
        size: number
        peer: number
        seed: number
        url: string
      }
    }
  }
  genres: string[]
}
