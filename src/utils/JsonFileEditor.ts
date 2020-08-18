import fs from 'fs'
import path from 'path'

const dir = __dirname

export class JsonFileEditor {
  static getFile<T>(name: string): T | undefined {
    const file = path.resolve(dir, '..', '..', 'files', name)
    if (fs.existsSync(file)) {
      const contents = fs.readFileSync(file, 'utf-8')
      return JSON.parse(contents)
    }
    return undefined
  }

  static saveFile(name: string, payload: Record<string, unknown>): void {
    const content = JSON.stringify(payload)
    fs.writeFileSync(path.resolve(dir, '..', '..', 'files', name), content, {
      encoding: 'utf-8',
    })
  }
}
