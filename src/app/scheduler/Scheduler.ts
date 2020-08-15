import nodeCron, { ScheduledTask } from 'node-cron'

export class NodeCronScheduler {
  scheduledTask: ScheduledTask
  jobs: Array<() => void>

  constructor(schedule = '0 * * * *') {
    this.jobs = new Array<() => void>()
    this.scheduledTask = nodeCron.schedule(schedule, () => this.runJobs(), {
      scheduled: false,
    })
  }

  start(): void {
    this.scheduledTask.start()
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
    this.scheduledTask.stop()
    this.scheduledTask.destroy()
    this.scheduledTask = nodeCron.schedule(time, () => this.runJobs())
  }
}
