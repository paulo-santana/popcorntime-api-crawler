import { Console } from 'console'
import Progress from 'progress'

export class Logger {
  private static logger: Console = new Console({
    stdout: process.stdout,
  })

  static print(entity: string, text: string): void {
    Logger.logger.log(`[${entity}]> ${text}`)
  }

  static startProgress(size: number): () => void {
    const progress = new Progress('[:bar] - :current/:total pages', {
      width: 40,
      total: size,
    })

    return () => progress.tick()
  }
}
