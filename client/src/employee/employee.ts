import { Identified } from "../utils/ducks";
import { Moment } from "moment";
import { WorkingDay } from "../workingDays/workingDay";
import { Job } from "../job/job";

export interface Employee extends Identified {
    name: string;
    contractHours: number;
    jobs: Job[];
    agenda: Agenda;
};

export interface Agenda extends Identified {
    holidays: Event[];
    special: Event[];
    workingDays: WorkingDay[];
}

export interface Event {
    name: string;
    from: Moment;
    to: Moment;
};