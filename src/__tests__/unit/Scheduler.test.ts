import Cron from 'cron'
import { mocked } from 'ts-jest/utils'
import { CronScheduler } from '@/app/scheduler/Scheduler'

jest.mock('cron')

const mockedCron = mocked(Cron, true)

// eslint-disable-next-line max-classes-per-file
const makeSut = () => {
  const scheduler = new CronScheduler()
  return { scheduler }
}

describe('Scheduler', () => {
  it('adds jobs to run', () => {
    const scheduler = new CronScheduler()
    const job = jest.fn()
    scheduler.addJob(job)
    expect(scheduler.jobs).toContain(job)
  })

  it('runs jobs at scheduled time', () => {
    const { scheduler } = makeSut()
    const job = jest.fn()
    jest
      .spyOn(mockedCron.CronJob.prototype, 'start')
      .mockImplementationOnce(() => {
        scheduler.runJobs()
      })
    scheduler.addJob(job)
    scheduler.start()
    expect(job).toBeCalled()
    jest.clearAllMocks()
  })
})
