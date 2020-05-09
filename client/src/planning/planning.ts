import { Identified } from "../utils/ducks";
import { Employee } from "../employee/employee";
import { Day, WorkingDay } from "../workingDays/workingDay";
import { Job } from "../job/job";

export const DEFAULT_CROSSOVER_RATE = 0.5;
export const DEFAULT_MUTATION_RATE = 0.01;

export interface Planning extends Identified {
  weekNumber: number;
  year: number;
  planning: { [day in Day]: Shift[] };
  meta: PlanningMetaData;
};

export interface PlanningSolution {
  days: WorkingDay[];
  jobs: Job[];
  employees: Employee[];
  shifts: Shift[];
  score: number;
}

export interface ScheduleSolution {
  readonly value: Schedule;
  readonly score: number;
  readonly days: WorkingDay[];
  readonly jobs: Job[];
  readonly employees: Employee[];
}
export interface Schedule {
  readonly days: WorkingDay[];
  readonly jobs: Job[];
  readonly employees: Employee[];

  shifts: Shift[][];
}

export interface PlanningMetaData {
  fitness: number;
};

export interface PlanningConfig {
  crossoverRate: number;
  mutationRate: number;
}

export interface Shift {
  day: WorkingDay;
  job: Job;
  employee: Employee;
}

export interface EmployeeStats {
  objective: number;
  totalHours: number;
  mismatchedJobs: string[];
}

export const getEmployeeStats = (schedule: Schedule) => {
  const shifts = Object.values(schedule.shifts).flat();
  const map = new Map<string, EmployeeStats>();
  shifts.filter(shift => Boolean(shift.employee)).forEach(shift => {
    const name = shift.employee.name;
    const stats = map.has(name) ? map.get(name) as EmployeeStats : { totalHours: 0, objective: 0, mismatchedJobs: [] };
    stats.totalHours = stats.totalHours + shift.job.duration;
    stats.objective = shift.employee.contractHours;
    if (!shift.employee.jobs.map(j => j.title).includes(shift.job.title)) {
      stats.mismatchedJobs.push(`${shift.job.title} (${shift.day.day})`)
    }
    map.set(name, stats);
  })
  return map;
}
