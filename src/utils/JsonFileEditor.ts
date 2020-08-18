import fs from 'fs'
import path from 'path'
import { IStorageManager } from '@/app/crawler'

export class JsonFileEditor implements IStorageManager {
  private dir = __dirname

  async getData(key: string): Promise<unknown> {
    const file = path.resolve(this.dir, '..', '..', 'files', key)
    return new Promise((resolve, reject) => {
      if (fs.existsSync(file)) {
        fs.readFile(file, { encoding: 'utf-8' }, (error, data) => {
          if (error) {
            reject(error)
          }
          resolve(data)
        })
      } else {
        resolve()
      }
    })
  }

  async saveData(key: string, data: Record<string, unknown>): Promise<void> {
    const content = JSON.stringify(data)
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.resolve(this.dir, '..', '..', 'files', key),
        content,
        {
          encoding: 'utf-8',
        },
        error => {
          if (error) reject(error)
          resolve()
        }
      )
    })
  }
}
