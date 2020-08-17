import { apiResources } from '@/__tests__/helpers/mocks/mocks'
import { PopcornAnimesAdapter } from '@/data/adapters/PopcornAnimesAdapter'
import { AnimesRepository } from '@/data/repositories'
import { Anime } from '@/data/models'
import { MongoHelper } from '@/data/repositories/helpers/MongoHelper'

const { MONGO_URL } = process.env

beforeAll(async () => {
  if (MONGO_URL !== undefined && MONGO_URL !== '') {
    await MongoHelper.connect(MONGO_URL)
  }
})

afterEach(async () => {
  await MongoHelper.getCollection('animes').deleteMany({})
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

const makeSut = async () => {
  const animesRepository = new AnimesRepository('animes')

  const animesFactory = () => {
    const popcornAnimes = apiResources.animes['animes/1']
    const adapter = new PopcornAnimesAdapter()
    const animes = adapter.adaptAnimes(popcornAnimes)
    return animes
  }

  return {
    animesRepository,
    animes: animesFactory(),
  }
}

describe('Animes Repository', () => {
  it('saves a list of animes correctly', async () => {
    const { animesRepository, animes } = await makeSut()
    await animesRepository.saveMany(animes)
    const savedAnimes = await MongoHelper.getCollection('animes')
      .find()
      .toArray()
    expect(savedAnimes).toEqual(animes)
  })

  it('gets the list of all animes in the database', async () => {
    const { animesRepository, animes } = await makeSut()
    await MongoHelper.getCollection('animes').insertMany(animes)
    const allAnimes = await animesRepository.getAll()
    expect(allAnimes).toEqual(animes)
  })
})
