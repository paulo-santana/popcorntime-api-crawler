import { IScheduler, SchedulerStatus } from '@/app/scheduler/IScheduler'

export type SchedulerControllerCommands =
  | 'start'
  | 'stop'
  | 'reschedule'
  | 'getInfo'

export class SchedulerController {
  scheduler: IScheduler

  constructor(scheduler: IScheduler) {
    this.scheduler = scheduler
  }

  getSchedulerInfo(): SchedulerStatus {
    return this.scheduler.getStatus()
  }

  startScheduler(): void {
    this.scheduler.start()
  }

  stopScheduler(): void {
    this.scheduler.stop()
  }

  reschedule(schedule: string): void {
    this.scheduler.reschedule(schedule)
  }
}
