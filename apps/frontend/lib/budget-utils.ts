import { Activity, ItineraryStop } from "@/data/data";

/**
 * Extracts and flattens all activities across all given stops.
 */
export function getAllActivities(stops: ItineraryStop[]): Activity[] {
  return stops.flatMap((stop) => stop.activities);
}

/**
 * Calculates the total cost for each category across all provided activities.
 * Returns an array of objects for easy mapping/charting.
 */
export function calculateCategoryTotals(activities: Activity[]) {
  const totals = {
    transport: 0,
    stay: 0,
    activities: 0,
    meals: 0,
  };

  activities.forEach((act) => {
    if (act.cost && act.category && totals[act.category] !== undefined) {
      totals[act.category] += act.cost;
    }
  });

  return [
    { category: "transport", label: "Transport", total: totals.transport },
    { category: "stay", label: "Stay", total: totals.stay },
    { category: "activities", label: "Activities", total: totals.activities },
    { category: "meals", label: "Meals", total: totals.meals },
  ];
}

export interface DailyTotal {
  day: number;
  cityName: string;
  totalCost: number;
}

/**
 * Groups activities by day across all stops and calculates the sum cost for each day.
 */
export function calculateDailyTotals(stops: ItineraryStop[]): DailyTotal[] {
  const daysMap = new Map<number, DailyTotal>();

  stops.forEach((stop) => {
    stop.activities.forEach((act) => {
      const current = daysMap.get(act.day) || { day: act.day, cityName: stop.city, totalCost: 0 };
      current.totalCost += act.cost || 0;
      daysMap.set(act.day, current);
    });
  });

  return Array.from(daysMap.values()).sort((a, b) => a.day - b.day);
}

/**
 * Calculates the average cost per day given an array of daily totals.
 */
export function calculateAverageCostPerDay(dailyTotals: DailyTotal[]): number {
  if (dailyTotals.length === 0) return 0;
  const sum = dailyTotals.reduce((acc, curr) => acc + curr.totalCost, 0);
  return Math.round(sum / dailyTotals.length);
}

/**
 * Returns an array of days whose total cost exceeds the given budget limit.
 */
export function findOverbudgetDays(dailyTotals: DailyTotal[], limit: number): DailyTotal[] {
  return dailyTotals.filter((day) => day.totalCost > limit);
}
