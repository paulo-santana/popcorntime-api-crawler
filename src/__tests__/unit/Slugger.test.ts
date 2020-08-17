import { Slugger } from '@/utils'

describe('Slugger', () => {
  it('slugs correctly', () => {
    const slugger = new Slugger()
    const title = 'Poeira em Alto Mar'
    const titleSlug = slugger.slug(title)
    expect(titleSlug).toBe('poeira-em-alto-mar')
  })

  it('slugs with id correctly', () => {
    const slugger = new Slugger()
    const title = 'A volta dos que não foram 2 - As tranças do Rei Careca'
    const id = 'id01'
    const titleSlug = slugger.slugWithId(title, id)
    expect(titleSlug).toBe(
      'a-volta-dos-que-nao-foram-2-as-trancas-do-rei-careca-id01'
    )
  })
})
