import { StateType } from 'typesafe-actions';
import planning from "../planning/planningDucks";
import employee from "../employee/employeeDucks";
import job from "../job/jobDucks";
import workingDay from "../workingDays/workingDayDucks";

const reducers = {
  planning,
  employee,
  job,
  workingDay,
};

export type RootState = StateType<typeof reducers>;
export default reducers;
