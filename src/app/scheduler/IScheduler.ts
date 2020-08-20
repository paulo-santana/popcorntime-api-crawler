export type SchedulerStatus = {
  status: 'idle' | 'running'
  nextSchedule: Date | undefined
}

export interface IScheduler {
  getStatus(): SchedulerStatus
  start(): void
  stop(): void
  reschedule(schedule: string): void
}
