import nodeCron, { ScheduledTask } from 'node-cron'
import { Logger, ILogger } from '../logger/Logger'

export type SchedulerConfigTypes = {
  logger?: ILogger
  loggingActive?: boolean
}

export class NodeCronScheduler {
  scheduledTask: ScheduledTask
  jobs: Array<() => void>

  private logger: ILogger
  private loggingActive = false

  constructor(schedule = '0 * * * *', config?: SchedulerConfigTypes) {
    this.jobs = new Array<() => void>()
    this.scheduledTask = nodeCron.schedule(schedule, () => this.runJobs(), {
      scheduled: false,
    })
    this.logger = config?.logger || new Logger()
    this.loggingActive = config?.loggingActive || false
  }

  private log(message: string) {
    if (this.loggingActive) {
      this.logger.print('Scheduler', message)
    }
  }

  start(): void {
    this.scheduledTask.start()
    this.log(`schedule started!`)
  }

  stop(): void {
    this.scheduledTask.stop()
  }

  addJob(job: () => void): void {
    this.jobs.push(job)
  }

  runJobs(): void {
    if (this.jobs) this.jobs.forEach(job => job())
  }

  reschedule(time = '0 * * * *'): void {
    this.log(`rescheduling to ${time}`)
    this.scheduledTask.stop()
    this.scheduledTask.destroy()
    this.scheduledTask = nodeCron.schedule(time, () => this.runJobs())
  }
}
