import { PopcornAnimesAdapter } from '@/data/adapters/PopcornAnimesAdapter'
import { Anime } from '@/data/models/Anime'
import { IRepository } from '@/data/repositories'
import { animesPagesTypes, apiResources } from '../../mocks'

const { animes } = apiResources

export class AnimesRepositoryStub implements IRepository<Anime> {
  animesPool: Anime[] = []

  /**
   * saves animes for each page, letting only one unsaved by page
   * returning them
   * @returns Anime[] - The animes which were not saved
   */
  simulatePreviousCrawlAndReturnUnsavedAnimes(): Anime[] {
    const adapter = new PopcornAnimesAdapter()
    const animesToSend = []
    for (let i = 0; i < animesPagesTypes.length; i++) {
      const page = animesPagesTypes[i]

      const adaptedAnimes = adapter.adaptAnimes(animes[page])

      // by starting at 1, we don't save index 0 and send it as return value
      for (let j = 1; j < adaptedAnimes.length; j++) {
        this.animesPool.push(adaptedAnimes[j])
      }

      animesToSend.push(adaptedAnimes[0])
    }

    return animesToSend
  }

  getAll(): Promise<Anime[]> {
    return new Promise(resolve => resolve(this.animesPool))
  }

  saveMany(animesToSave: Anime[]): void {
    this.animesPool.push(...animesToSave)
  }
}
