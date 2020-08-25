import cron from 'cron'
import { SchedulerConfigTypes, BaseScheduler } from './BaseScheduler'

export class CronScheduler extends BaseScheduler {
  scheduledTask: cron.CronJob

  constructor(schedule = '0 * * * *', config?: SchedulerConfigTypes) {
    super(config)
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
    return this.scheduledTask.nextDate().toDate()
  }

  reschedule(schedule: string): void {
    const time = cron.time(schedule)
    this.scheduledTask.setTime(time)
    super.reschedule(schedule)
  }
}
