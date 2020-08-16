import { apiResources } from '@/__tests__/helpers/mocks/mocks'
import { PopcornAnimesAdapter } from '@/data/adapters/PopcornAnimesAdapter'
import { AnimesRepository } from '@/data/repositories'
import { MongoClient, Db } from 'mongodb'
import { Anime } from '@/data/models'
import dotenv from 'dotenv'

dotenv.config()

const { MONGO_URL } = process.env
let client: MongoClient
let db: Db

beforeAll(async () => {
  if (MONGO_URL !== undefined && MONGO_URL !== '') {
    client = await MongoClient.connect(MONGO_URL, {
      useUnifiedTopology: true,
    })
    db = client.db()
  }
})

afterEach(async () => {
  await db.dropCollection('animes')
})

afterAll(async () => {
  await client.close()
})

const makeSut = async () => {
  const animesRepository = new AnimesRepository(db, 'animes')

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
    const savedAnimes = await db.collection<Anime>('animes').find().toArray()
    expect(animes).toEqual(savedAnimes)
  })

  it('gets the list of all animes in the database', async () => {
    const { animesRepository, animes } = await makeSut()
    await db.collection('animes').insertMany(animes)
    const allAnimes = await animesRepository.getAll()
    expect(allAnimes).toEqual(animes)
  })
})
