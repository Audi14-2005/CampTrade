export function remainingDays(iso: string) {
  const end = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  return diff
}
