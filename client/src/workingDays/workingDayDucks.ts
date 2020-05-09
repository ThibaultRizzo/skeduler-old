import { WorkingDay } from './workingDay';
import { buildTestableCrudDucks } from '../utils/buildCrudDucks';

const { loadItem, loadListIfNeeded, loadList, saveItem, deleteItem, resetItem, saga, reducer } = buildTestableCrudDucks<WorkingDay>(
    'WORKING_DAY',
    '/api/workingDay',
    state => state.workingDay
);

export { loadItem, loadListIfNeeded, loadList, saveItem, deleteItem, resetItem, saga };
export default reducer;
