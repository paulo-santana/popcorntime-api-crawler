import nodeCron, { ScheduledTask } from 'node-cron'
import { Logger } from '../logger/Logger'

export class NodeCronScheduler {
  scheduledTask: ScheduledTask
  jobs: Array<() => void>
  private loggingActive = true

  constructor(schedule = '0 * * * *') {
    this.jobs = new Array<() => void>()
    this.scheduledTask = nodeCron.schedule(schedule, () => this.runJobs(), {
      scheduled: false,
    })
  }

  private log(message: string) {
    if (this.loggingActive) {
      Logger.print('Scheduler', message)
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
