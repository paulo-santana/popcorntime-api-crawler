import { Router, Request, Response } from 'express'
import {
  SchedulerController,
  SchedulerControllerCommands,
} from '../controllers'

const routes = Router()

const createRoutes = (schedulerController: SchedulerController): Router => {
  routes.get('/scheduler', (req, res: Response) => {
    res.json(schedulerController.getSchedulerInfo())
  })

  routes.post('/scheduler', (req: Request, res: Response) => {
    const { command }: { command: SchedulerControllerCommands } = req.body
    switch (command) {
      case 'start':
        schedulerController.startScheduler()
        res.json(schedulerController.getSchedulerInfo())
        break
      case 'stop':
        schedulerController.stopScheduler()
        res.json(schedulerController.getSchedulerInfo())
        break
      case 'reschedule': {
        const { schedule } = req.body
        schedulerController.reschedule(schedule)
        res.json(schedulerController.getSchedulerInfo())
        break
      }
      default: {
        res.status(400).json({
          error: 'Invalid command',
        })
        break
      }
    }
  })

  return routes
}

export default createRoutes
