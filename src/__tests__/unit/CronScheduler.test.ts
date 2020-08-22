/* eslint-disable @typescript-eslint/no-empty-function */
import cron, { CronTime } from 'cron'
import { CronScheduler } from '@/app/scheduler'

jest.mock('cron', () => {
  class CronJob {
    job: () => void

    constructor(schedule: string, job: () => void) {
      this.job = job
    }

    start() {
      this.job()
    }

    stop() {}

    setTime(time: CronTime) {}
  }

  return {
    CronJob,
    time: jest.fn(),
  }
})

const makeSut = () => {
  class TestCronScheduler extends CronScheduler {
    getJobs() {
      return this.jobs
    }
  }
  const scheduler = new TestCronScheduler()
  return { scheduler }
}

describe('Cron Scheduler', () => {
  it('adds jobs to run', () => {
    const { scheduler } = makeSut()
    const job = jest.fn()
    scheduler.addJob(job)
    expect(scheduler.getJobs()).toContain(job)
  })

  it('runs jobs at scheduled time', () => {
    const { scheduler } = makeSut()
    const job = jest.fn()
    const start = jest.spyOn(cron.CronJob.prototype, 'start')
    scheduler.addJob(job)
    scheduler.start()
    expect(job).toBeCalled()
    expect(start).toHaveBeenCalled()
  })

  it('should be able to stop timer', () => {
    const { scheduler } = makeSut()
    const job = jest.fn()
    const stop = jest.spyOn(cron.CronJob.prototype, 'stop')
    scheduler.addJob(job)
    scheduler.start()
    scheduler.stop()
    expect(stop).toBeCalled()
  })

  it('should be able to reschedule', () => {
    const { scheduler } = makeSut()
    const job = jest.fn()
    const stop = jest.spyOn(scheduler.scheduledTask, 'stop')
    const setTime = jest.spyOn(cron.CronJob.prototype, 'setTime')
    scheduler.addJob(job)
    scheduler.start()
    scheduler.reschedule('*/5 * * * *')
    expect(stop).toBeCalled()
    expect(setTime).toBeCalled()
  })

  describe('status', () => {
    it('updates status according to command', () => {
      const { scheduler } = makeSut()
      expect(scheduler.getStatus().status).toBe('idle')
      scheduler.start()
      expect(scheduler.getStatus().status).toBe('running')
      expect(scheduler.getStatus().nextSchedule).toBeDefined()
      scheduler.stop()
      expect(scheduler.getStatus().status).toBe('idle')
      expect(scheduler.getStatus().nextSchedule).toBeUndefined()
      scheduler.reschedule('* * * * *')
      expect(scheduler.getStatus().status).toBe('running')
      expect(scheduler.getStatus().nextSchedule).toBeDefined()
    })
  })
})
