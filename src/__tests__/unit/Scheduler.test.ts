import Cron from 'cron'
import { mocked } from 'ts-jest/utils'

jest.mock('cron')

const mockedCron = mocked(Cron, true)

// eslint-disable-next-line max-classes-per-file
class CronScheduler {
  timer: Cron.CronJob
  jobs: Array<() => void> = []

  constructor(schedule = '0 * * * *') {
    this.timer = new Cron.CronJob(schedule, this.runJobs)
  }

  start() {
    this.timer.start()
  }

  stop() {
    this.timer.stop()
  }

  addJob(job: () => void) {
    this.jobs.push(job)
  }

  runJobs() {
    this.jobs.forEach(job => job())
  }
}

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
