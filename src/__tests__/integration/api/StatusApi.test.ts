import { StatusApi } from '@/data/api'
import { AxiosHttpClient } from '@/services/HttpClient'

jest.unmock('axios')

describe('StatusApi', () => {
  it('fetches correctly', async () => {
    const client = new AxiosHttpClient('https://anime.api-fetch.sh')
    const statusApi = new StatusApi(client)
    const status = await statusApi.getStatus()
    expect(status).toBeDefined()
    expect(status.status).toBeDefined()
  })
})
