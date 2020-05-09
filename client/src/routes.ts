import PlanningPage from "./planning/PlanningPage";
import EmployeePage from "./employee/EmployeePage";
import JobPage from "./job/JobPage";

type PageDefinition = (
  | {
    key: string;
  }
  | {
    path: string | string[];
  }) & {
    component: React.ComponentType<any>;
  };

const routes: PageDefinition[] = [
  {
    component: PlanningPage,
    path: ['/', '/planning'],
  },
  {
    component: EmployeePage,
    path: '/employee',
  },
  {
    component: JobPage,
    path: '/job',
  },
];

export default routes;
