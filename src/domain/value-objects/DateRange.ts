export interface DateRange {
  readonly start: string;
  readonly end: string;
}

export function createDateRange(start: string, end: string): DateRange {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date');
  }
  if (startDate > endDate) {
    throw new Error('Start date must be before end date');
  }
  return { start: startDate.toISOString(), end: endDate.toISOString() };
}

export function isInRange(date: string, range: DateRange): boolean {
  const d = new Date(date);
  return d >= new Date(range.start) && d <= new Date(range.end);
}

export function rangeDuration(range: DateRange): number {
  return new Date(range.end).getTime() - new Date(range.start).getTime();
}
