import { Job } from './job';
import { buildTestableCrudDucks } from '../utils/buildCrudDucks';

const { loadItem, loadListIfNeeded, loadList, saveItem, deleteItem, resetItem, saga, reducer } = buildTestableCrudDucks<Job>(
    'POSITION',
    '/api/job',
    state => state.job
);

export { loadItem, loadListIfNeeded, loadList, saveItem, deleteItem, resetItem, saga };
export default reducer;
