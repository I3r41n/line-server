import { preprocessor } from '../src/preprocessor'

describe('File preprocessor', () => {
  it('should return an empty array when the file is empty', async () => {
    const res = await preprocessor('/Users/bsantos/projects/line-server/data/empty')
    expect(res).toEqual([])
  })

  it('should return an array with two positions representing the beginning and end of the first and only line', async () => {
    const res = await preprocessor('/Users/bsantos/projects/line-server/data/one')
    expect(res).toEqual([0, 575])
  })

  it('should return an array with one position representing the end of the first and only line', async () => {
    const res = await preprocessor('/Users/bsantos/projects/line-server/data/four')
    expect(res).toEqual([0, 575, 1150, 1725, 2300])
  })
})
