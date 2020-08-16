// eslint-disable-next-line max-classes-per-file
import { IDatabaseClient } from '@/data/database/IDatabaseClient'
import { Anime } from '@/data/models/Anime'
import { apiResources } from '@/__tests__/helpers/mocks/mocks'
import { PopcornAnimesAdapter } from '@/data/adapters/PopcornAnimesAdapter'
import { AnimesRepository } from '@/data/repositories/AnimesRepository'

const makeSut = () => {
  class DatabaseClientSpy implements IDatabaseClient<Anime> {
    pool: Array<Anime> = []

    saveMany(items: Anime[]): Promise<void> {
      this.pool.push(...items)
      return Promise.resolve()
    }

    getAll(): Promise<Anime[]> {
      return Promise.resolve(this.pool)
    }
  }

  const databaseClientSpy = new DatabaseClientSpy()
  const animesRepository = new AnimesRepository(databaseClientSpy)

  const animesFactory = () => {
    const popcornAnimes = apiResources.animes['animes/1']
    const adapter = new PopcornAnimesAdapter()
    const animes = adapter.adaptAnimes(popcornAnimes)
    return animes
  }

  return {
    animesRepository,
    databaseClientSpy,
    animes: animesFactory(),
  }
}

describe('Animes Repository', () => {
  it('saves a list of animes correctly', async () => {
    const { animesRepository, databaseClientSpy, animes } = makeSut()
    const saveMany = jest.spyOn(databaseClientSpy, 'saveMany')
    await animesRepository.saveMany(animes)
    expect(saveMany).toHaveBeenCalledWith(animes)
  })

  it('gets the list of all animes in the database', async () => {
    const { animes, databaseClientSpy, animesRepository } = makeSut()
    const getAll = jest.spyOn(databaseClientSpy, 'getAll')
    databaseClientSpy.pool.push(...animes)
    const allAnimes = await animesRepository.getAll()
    expect(getAll).toHaveBeenCalled()
    expect(allAnimes).toEqual(animes)
  })
})
