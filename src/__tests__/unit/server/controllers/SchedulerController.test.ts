interface IScheduler {
  getStatus(): SchedulerStatus
}

type SchedulerStatus = {
  status: string
  nextSchedule: Date
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
  }

  class SchedulerStub implements IScheduler {
    getStatus(): SchedulerStatus {
      const now = new Date()
      now.setHours(now.getHours() + 1)
      return {
        status: 'running',
        nextSchedule: now,
      }
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
    expect(info.status).toBe('running')
    expect(info.nextSchedule).toBeDefined()
  })
})
