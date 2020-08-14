class Scheduler {
  jobs: Array<() => void> = []
  addJob(job: () => void) {
    this.jobs.push(job)
  }
}

describe('Scheduler', () => {
  it('adds jobs to run', () => {
    const scheduler = new Scheduler()
    const job = jest.fn()
    scheduler.addJob(job)
    expect(scheduler.jobs).toContain(job)
  })
})
