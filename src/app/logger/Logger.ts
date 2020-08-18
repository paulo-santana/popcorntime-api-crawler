import { Console } from 'console'
import Progress from 'progress'

export interface ILogger {
  print(entity: string, text: string): void
  startProgress(size: number): () => void
}

export class Logger implements ILogger {
  private static logger: Console = new Console({
    stdout: process.stdout,
  })

  print(entity: string, text: string): void {
    Logger.logger.log(`[${entity}]> ${text}`)
  }

  startProgress(size: number): () => void {
    const progress = new Progress('[:bar] - :current/:total pages', {
      width: 40,
      total: size,
    })

    return () => progress.tick()
  }
}
