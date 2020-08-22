import cron from 'cron'
import { BaseScheduler } from '@/app/scheduler'

export class CronScheduler extends BaseScheduler {
  scheduledTask: cron.CronJob

  constructor(schedule = '0 * * * *') {
    super()
    this.scheduledTask = new cron.CronJob(schedule, () => this.runJobs())
  }

  start(): void {
    this.scheduledTask.start()
    super.start()
  }

  stop(): void {
    this.scheduledTask.stop()
    super.stop()
  }

  getNextSchedule(): Date {
    return new Date()
  }

  reschedule(schedule: string): void {
    const time = cron.time(schedule)
    this.scheduledTask.setTime(time)
    super.reschedule(schedule)
  }
}
