import nodeCron, { ScheduledTask } from 'node-cron'
import { BaseScheduler, SchedulerConfigTypes } from './BaseScheduler'

export class NodeCronScheduler extends BaseScheduler {
  getNextSchedule(): Date {
    return new Date()
  }
  scheduledTask: ScheduledTask

  constructor(schedule = '0 * * * *', config?: SchedulerConfigTypes) {
    super(config)
    this.scheduledTask = nodeCron.schedule(schedule, () => this.runJobs(), {
      scheduled: false,
    })
  }

  start(): void {
    this.scheduledTask.start()
    super.start()
  }

  stop(): void {
    this.scheduledTask.stop()
    super.stop()
  }

  reschedule(schedule = '0 * * * *'): void {
    this.scheduledTask.stop()
    this.scheduledTask.destroy()
    this.scheduledTask = nodeCron.schedule(schedule, () => this.runJobs())
    super.reschedule(schedule)
  }
}
