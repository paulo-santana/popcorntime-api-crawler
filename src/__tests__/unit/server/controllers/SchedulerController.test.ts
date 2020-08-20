interface IScheduler {
  getStatus(): SchedulerStatus
  start(): void
}

type SchedulerStatus = {
  status: string
  nextSchedule: Date | undefined
}

const makeSut = () => {
  class SchedulerController {
    scheduler: IScheduler

    constructor(scheduler: IScheduler) {
      this.scheduler = scheduler
    }

    getSchedulerInfo(): SchedulerStatus {
      return this.scheduler.getStatus()
    }

    startScheduler(): void {
      this.scheduler.start()
    }
  }

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
})
