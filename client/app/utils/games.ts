export function selectRandomIds(ids: number[], count = 15, random = Math.random): number[] {
  const shuffled = [...new Set(ids)]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex]!, shuffled[index]!]
  }

  return shuffled.slice(0, count)
}
