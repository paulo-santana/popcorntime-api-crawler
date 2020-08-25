import express from 'express'

import { IScheduler } from '@/app/scheduler'
import { SchedulerController } from './controllers'

import createSchedulerRoutes from './routes/schedulerRoutes'

export class CrawlerServer {
  schedulerController: SchedulerController
  express: express.Express
  port: number

  constructor(port: number, scheduler: IScheduler) {
    this.express = express()
    this.express.use(express.json())
    this.schedulerController = new SchedulerController(scheduler)
    this.port = port
    this.setupRoutes()
  }

  start(): void {
    this.express.listen(this.port, () => {
      console.log(`server listening on ${this.port}`)
    })
  }

  setupRoutes(): void {
    const schedulerRoutes = createSchedulerRoutes(this.schedulerController)
    this.express.use(schedulerRoutes)
  }
}
