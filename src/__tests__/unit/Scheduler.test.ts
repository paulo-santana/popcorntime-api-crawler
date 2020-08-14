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
        mockedCron.CronJob.prototype.running = true
        scheduler.runJobs()
      })
    scheduler.addJob(job)
    expect(scheduler.timer.running).not.toBe(true)
    scheduler.start()
    expect(job).toBeCalled()
    expect(scheduler.timer.running).toBe(true)
    jest.clearAllMocks()
  })

  it('should be able to stop timer', () => {
    const { scheduler } = makeSut()
    const stop = jest
      .spyOn(mockedCron.CronJob.prototype, 'stop')
      .mockImplementationOnce(() => {
        mockedCron.CronJob.prototype.running = false
      })
    scheduler.start()
    scheduler.stop()
    expect(stop).toBeCalledTimes(1)
    expect(scheduler.timer.running).toBe(false)
  })
})
