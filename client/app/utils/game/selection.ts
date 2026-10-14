export function selectRandomIds(ids: number[], count: number, random = Math.random): number[] {
  if (!Number.isInteger(count) || count <= 0) return []

  const shuffled = [...new Set(ids)]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex]!, shuffled[index]!]
  }

  return shuffled.slice(0, count)
}
