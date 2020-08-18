import { mocked } from 'ts-jest/utils'
import { AxiosHttpClient } from '@/services/HttpClient'
import { apiStatusStub } from '@/__tests__/helpers/mocks/mocks'
import axios from 'axios'

const mockedAxios = mocked(axios, true)

const makeSut = () => {
  const axiosClient = new AxiosHttpClient('https://movies-v2.api-fetch.sh')
  return { axiosClient }
}

describe('AxiosHttpClient', () => {
  it('should fetch endpoints and return response as string', async () => {
    const { axiosClient } = makeSut()
    mockedAxios.get.mockResolvedValueOnce({
      data: apiStatusStub,
    })
    const response = await axiosClient.get('status')

    expect(response).toEqual(JSON.stringify(apiStatusStub))
  })

  it('fetches path sent in parameter', async () => {
    const { axiosClient } = makeSut()
    const clientGet = jest
      .spyOn(mockedAxios, 'get')
      .mockResolvedValue({ data: 'foo' })
    await axiosClient.get('status')
    expect(clientGet).toBeCalledWith('status', { responseType: 'text' })

    await axiosClient.get('movies/1')
    expect(clientGet).toBeCalledWith('movies/1', { responseType: 'text' })
  })
})
