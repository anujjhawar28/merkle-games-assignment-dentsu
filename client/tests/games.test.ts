import { describe, expect, it } from 'vitest'
import { selectRandomIds } from '../app/utils/games'

describe('game utilities', () => {
  it('selects a unique random sample without mutating the API ids', () => {
    const ids = [1, 2, 2, 3, 4]
    const selected = selectRandomIds(ids, 3, () => 0)

    expect(selected).toHaveLength(3)
    expect(new Set(selected).size).toBe(3)
    expect(ids).toEqual([1, 2, 2, 3, 4])
  })


})