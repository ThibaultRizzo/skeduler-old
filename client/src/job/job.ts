import { Identified } from "../utils/ducks";

export interface Job extends Identified {
  title: string;
  duration: number;
};
