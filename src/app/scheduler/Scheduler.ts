import { CronJob } from 'cron'

export class CronScheduler {
  timer: CronJob
  jobs: Array<() => void> = []

  constructor(schedule = '0 * * * *') {
    this.timer = new CronJob(schedule, this.runJobs)
  }

  start(): void {
    this.timer.start()
  }

  stop(): void {
    this.timer.stop()
  }

  addJob(job: () => void): void {
    this.jobs.push(job)
  }

  runJobs(): void {
    this.jobs.forEach(job => job())
  }
}
