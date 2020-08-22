import nodeCron, { ScheduledTask, ScheduleOptions } from 'node-cron'
import { NodeCronScheduler } from '@/app/scheduler'
import { mocked } from 'ts-jest/utils'

class ScheduledTaskSpy implements ScheduledTask {
  cronExpression: string
  func: () => void
  options?: ScheduleOptions

  constructor(
    cronExpression: string,
    func: () => void,
    options?: ScheduleOptions
  ) {
    this.cronExpression = cronExpression
    this.func = func
    this.options = options
  }

  start(): this {
    this.func()
    return this
  }

  stop(): this {
    return this
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  destroy(): void {}
  getStatus(): string {
    return ''
  }
}

jest.mock('node-cron', () => {
  return {
    schedule: (
      cronExpression: string,
      func: () => void,
      options: ScheduleOptions
    ) => new ScheduledTaskSpy(cronExpression, func, options),
  }
})

const mockedNodeCron = mocked(nodeCron, true)

const makeSut = () => {
  class TestNodeCronScheduler extends NodeCronScheduler {
    getJobs() {
      return this.jobs
    }
  }
  const scheduler = new TestNodeCronScheduler()
  return { scheduler }
}

describe('NodeCron Scheduler', () => {
  it('adds jobs to run', () => {
    const { scheduler } = makeSut()
    const job = jest.fn()
    scheduler.addJob(job)
    expect(scheduler.getJobs()).toContain(job)
  })

  it('runs jobs at scheduled time', () => {
    const { scheduler } = makeSut()
    const job = jest.fn()
    scheduler.addJob(job)
    scheduler.start()
    expect(scheduler.getJobs()).toContain(job)
    expect(job).toBeCalled()
  })

  it('should be able to stop timer', () => {
    const { scheduler } = makeSut()
    const job = jest.fn()
    const stop = jest.spyOn(scheduler.scheduledTask, 'stop')
    scheduler.addJob(job)
    scheduler.start()
    scheduler.stop()
    expect(stop).toBeCalled()
  })

  it('should be able to reschedule', () => {
    const { scheduler } = makeSut()
    const job = jest.fn()
    const stop = jest.spyOn(scheduler.scheduledTask, 'stop')
    const destroy = jest.spyOn(scheduler.scheduledTask, 'destroy')
    const schedule = jest.spyOn(mockedNodeCron, 'schedule')
    scheduler.addJob(job)
    scheduler.start()
    scheduler.reschedule('*/5 * * * *')
    expect(stop).toBeCalled()
    expect(destroy).toBeCalled()
    expect(schedule).toBeCalled()
  })

  describe('status', () => {
    it('updates status according to command', () => {
      const { scheduler } = makeSut()
      const status = scheduler.getStatus()
      expect(status.status).toBe('idle')
      scheduler.start()
      expect(status.status).toBe('running')
      expect(status.nextSchedule).toBeDefined()
      scheduler.stop()
      expect(status.status).toBe('idle')
      expect(status.nextSchedule).toBeUndefined()
      scheduler.reschedule('* * * * *')
      expect(status.status).toBe('running')
      expect(status.nextSchedule).toBeDefined()
    })
  })
})
