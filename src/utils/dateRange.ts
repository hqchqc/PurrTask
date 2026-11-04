export function getLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export function getLocalDateRange(days: number, now = new Date()) {
  if (!Number.isInteger(days) || days < 1) {
    throw new RangeError('days must be a positive integer')
  }

  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days + 1)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

  return {
    start: start.getTime(),
    end: end.getTime(),
  }
}

export function getPreviousWeekRange(now = new Date()) {
  const thisMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const daysSinceMonday = (thisMonday.getDay() + 6) % 7
  thisMonday.setDate(thisMonday.getDate() - daysSinceMonday)

  const start = new Date(thisMonday)
  start.setDate(start.getDate() - 7)

  return {
    start: start.getTime(),
    end: thisMonday.getTime(),
  }
}
