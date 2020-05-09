import { Employee } from './employee';
import { buildTestableCrudDucks } from '../utils/buildCrudDucks';

const { loadItem, loadListIfNeeded, loadList, saveItem, deleteItem, resetItem, saga, reducer } = buildTestableCrudDucks<Employee>(
    'EMPLOYEE',
    '/api/employee',
    state => state.employee
);

export { loadItem, loadListIfNeeded, loadList, saveItem, deleteItem, resetItem, saga };
export default reducer;
