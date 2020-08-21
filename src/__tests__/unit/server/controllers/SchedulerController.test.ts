import { SchedulerController } from '@/app/server/controllers'
import { IScheduler, SchedulerStatus } from '@/app/scheduler/IScheduler'

const makeSut = () => {
  class SchedulerStub implements IScheduler {
    status: SchedulerStatus

    constructor() {
      this.status = {
        status: 'idle',
        nextSchedule: undefined,
      }
    }

    start(): void {
      const now = new Date()
      now.setHours(now.getHours() + 1)
      this.status.status = 'running'
      this.status.nextSchedule = now
    }

    stop(): void {
      this.status.status = 'idle'
      this.status.nextSchedule = undefined
    }

    reschedule(schedule: string) {
      this.status.status = 'running'
      this.status.nextSchedule = new Date()
    }

    getStatus(): SchedulerStatus {
      return this.status
    }
  }

  const scheduler = new SchedulerStub()

  const sut = new SchedulerController(scheduler)
  return { sut, scheduler }
}

describe('Scheduler Controller', () => {
  it('returns scheduler info', () => {
    const { sut, scheduler } = makeSut()
    const getStatus = jest.spyOn(scheduler, 'getStatus')
    const info = sut.getSchedulerInfo()
    expect(getStatus).toHaveBeenCalled()
    expect(info.status).toBe('idle')
    expect(info.nextSchedule).toBeUndefined()
  })

  it('starts scheduler timer', () => {
    const { sut, scheduler } = makeSut()
    const start = jest.spyOn(scheduler, 'start')
    sut.startScheduler()
    const status = sut.getSchedulerInfo()
    expect(start).toHaveBeenCalled()
    expect(status.status).toBe('running')
    expect(status.nextSchedule).toBeDefined()
  })

  it('stops scheduler', () => {
    const { sut, scheduler } = makeSut()
    const stop = jest.spyOn(scheduler, 'stop')
    sut.startScheduler()
    sut.stopScheduler()
    expect(stop).toHaveBeenCalled()
  })

  it('sets a new schedule', () => {
    const { sut, scheduler } = makeSut()
    const schedule = '* * * * *'
    const reschedule = jest.spyOn(scheduler, 'reschedule')
    sut.reschedule(schedule)
    expect(reschedule).toHaveBeenCalledWith(schedule)
  })
})
