/**
 * Utility functions for budget year management
 */

export const BUDGET_YEARS = {
  START_YEAR: 2022,
  END_YEAR: 2030,
  DEFAULT_YEAR: 2024
};

export function getBudgetYears(): number[] {
  const years = [];
  for (let year = BUDGET_YEARS.START_YEAR; year <= BUDGET_YEARS.END_YEAR; year++) {
    years.push(year);
  }
  return years;
}

export function getBudgetYearsDescending(): number[] {
  return getBudgetYears().reverse();
}

export function isValidBudgetYear(year: number): boolean {
  return year >= BUDGET_YEARS.START_YEAR && year <= BUDGET_YEARS.END_YEAR;
}

export function getCurrentBudgetYear(): number {
  const currentYear = new Date().getFullYear();
  if (isValidBudgetYear(currentYear)) {
    return currentYear;
  }
  return BUDGET_YEARS.DEFAULT_YEAR;
}

export function getBudgetYearOptions() {
  return getBudgetYearsDescending().map(year => ({
    value: year.toString(),
    label: year.toString()
  }));
}

export function formatBudgetPeriod(startYear?: number, endYear?: number): string {
  const start = startYear || getCurrentBudgetYear();
  const end = endYear || BUDGET_YEARS.END_YEAR;
  return `${start}-${end}`;
}