import { Logger, ILogger } from '../logger/Logger'
import { IScheduler, SchedulerStatus } from './IScheduler'

export type SchedulerConfigTypes = {
  logger?: ILogger
  loggingActive?: boolean
}

export abstract class BaseScheduler implements IScheduler {
  protected status: SchedulerStatus
  protected jobs: Array<() => void> = new Array<() => void>()

  protected logger: ILogger
  protected loggingActive = false

  constructor(config?: SchedulerConfigTypes) {
    this.logger = config?.logger || new Logger()
    this.loggingActive = config?.loggingActive || false
    this.status = {
      status: 'idle',
      nextSchedule: undefined,
    }
  }

  protected log(message: string): void {
    if (this.loggingActive) {
      this.logger.print('Scheduler', message)
    }
  }

  getStatus(): SchedulerStatus {
    return this.status
  }

  start(): void {
    this.status.status = 'running'
    this.status.nextSchedule = this.getNextSchedule()
    this.log(`scheduler started!`)
  }

  abstract getNextSchedule(): Date

  stop(): void {
    this.status.status = 'idle'
    this.status.nextSchedule = undefined
    this.log('scheduler stopped')
  }

  addJob(job: () => void): void {
    this.jobs.push(job)
  }

  runJobs(): void {
    if (this.jobs) this.jobs.forEach(job => job())
  }

  reschedule(schedule: string): void {
    this.log(`rescheduling to ${schedule}`)
    this.status.status = 'running'
    this.status.nextSchedule = this.getNextSchedule()
  }
}
