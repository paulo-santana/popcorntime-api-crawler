export interface ISlugger {
  slugWithId(title: string, id: string): string
  slug(title: string): string
}

export class Slugger implements ISlugger {
  slugWithId(title: string, id: string): string {
    return this.slugify(`${title}-${id}`)
  }

  slug(title: string): string {
    return this.slugify(title)
  }

  // Slugify a string
  private slugify(text: string) {
    let str = text.replace(/^\s+|\s+$/g, '')

    // Make the string lowercase
    str = str.toLowerCase()

    // Remove accents, swap ñ for n, etc
    const from =
      'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆaİĞŞığş·/_,:;'
    const to =
      'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAaIGSigs------'

    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
    }

    // Remove invalid chars
    str = str
      .replace(/[^a-z0-9 -]/g, '')
      // Collapse whitespace and replace by -
      .replace(/\s+/g, '-')
      // Collapse dashes
      .replace(/-+/g, '-')

    return str
  }
}
