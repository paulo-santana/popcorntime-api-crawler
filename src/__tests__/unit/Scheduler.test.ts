import nodeCron, { ScheduledTask, ScheduleOptions } from 'node-cron'
import { NodeCronScheduler } from '@/app/scheduler/Scheduler'
import { mocked } from 'ts-jest/utils'

class ScheduledTaskSpy implements ScheduledTask {
  func: () => void

  constructor(
    private readonly cronExpression: string,
    func: () => void,
    private readonly options?: ScheduleOptions
  ) {
    this.func = func
  }

  start(): this {
    this.func()
    return this
  }

  stop(): this {
    return this
  }
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
  const scheduler = new NodeCronScheduler()
  return { scheduler }
}

describe('Scheduler', () => {
  it('adds jobs to run', () => {
    const { scheduler } = makeSut()
    const job = jest.fn()
    scheduler.addJob(job)
    expect(scheduler.jobs).toContain(job)
  })

  it('runs jobs at scheduled time', () => {
    const { scheduler } = makeSut()
    const job = jest.fn()
    scheduler.addJob(job)
    scheduler.start()
    expect(scheduler.jobs).toContain(job)
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
})
