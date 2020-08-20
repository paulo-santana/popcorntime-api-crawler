interface IScheduler {
  getStatus(): string
}

const makeSut = () => {
  class SchedulerController {
    scheduler: IScheduler

    constructor(scheduler: IScheduler) {
      this.scheduler = scheduler
    }

    getSchedulerInfo() {
      return this.scheduler.getStatus()
    }
  }

  class SchedulerStub implements IScheduler {
    getStatus(): string {
      return 'running'
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
    expect(info).toEqual('running')
  })
})
