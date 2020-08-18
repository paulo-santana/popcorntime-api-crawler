import nodeCron, { ScheduledTask } from 'node-cron'
import { Logger, ILogger } from '../logger/Logger'

export class NodeCronScheduler {
  scheduledTask: ScheduledTask
  jobs: Array<() => void>

  private logger: ILogger
  private loggingActive = true

  constructor(schedule = '0 * * * *') {
    this.jobs = new Array<() => void>()
    this.scheduledTask = nodeCron.schedule(schedule, () => this.runJobs(), {
      scheduled: false,
    })
    this.logger = new Logger()
  }

  private log(message: string) {
    if (this.loggingActive) {
      this.logger.print('Scheduler', message)
    }
  }

  start(): void {
    this.scheduledTask.start()
    this.log(`status: ${this.scheduledTask.getStatus()}`)
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

  reschedule(time: string): void {
    this.log(`rescheduling to ${time}`)
    this.scheduledTask.stop()
    this.scheduledTask.destroy()
    this.scheduledTask = nodeCron.schedule(time, () => this.runJobs())
  }
}
