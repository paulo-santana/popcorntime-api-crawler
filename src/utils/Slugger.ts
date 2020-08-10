export interface ISlugger {
  slugWithId(title: string, id: string): string
  slug(title: string): string
}

export class Slugger implements ISlugger {
  slugWithId(title: string, id: string): string {
    return `${title}-${id}`
  }
  slug(title: string): string {
    return title
  }
}
