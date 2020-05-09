import { saga as planningSaga } from '../planning/planningDucks'
import { saga as employeeSaga } from '../employee/employeeDucks'
import { saga as jobSaga } from '../job/jobDucks'
import { saga as workingDaySaga } from '../workingDays/workingDayDucks';

export default [
    planningSaga,
    employeeSaga,
    jobSaga,
    workingDaySaga
]
