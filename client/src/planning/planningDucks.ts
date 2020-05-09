import { Planning, DEFAULT_CROSSOVER_RATE, DEFAULT_MUTATION_RATE, PlanningConfig, ScheduleSolution, PlanningSolution } from './planning';
import { call, take, select, race, put, takeLatest, delay } from 'redux-saga/effects';
import apiHelper from '../api/apiHelper';
import { buildTestableCrudDucks } from '../utils/buildCrudDucks';
import { createAsyncAction, PayloadAction, EmptyAction } from 'typesafe-actions';
import { eventChannel, END } from 'redux-saga';

const prefix = 'PLANNING';
const apiPath = '/api/plannings';

const { loadItem, loadListIfNeeded, loadList, saveItem, deleteItem, resetItem, saga: initialSaga,
  reducer: initialReducer, } = buildTestableCrudDucks<Planning>(
    prefix,
    apiPath,
    state => state.planning
  );

const LOAD_LATEST_REQUEST = `${prefix}/LOAD_LATEST_REQUEST`;
const LOAD_LATEST_SUCCESS = `${prefix}/LOAD_LATEST_SUCCESS`;
const LOAD_LATEST_FAILURE = `${prefix}/LOAD_LATEST_FAILURE`;


const GENERATE_REQUEST = `${prefix}/GENERATE_REQUEST`;
const GENERATE_SUCCESS = `${prefix}/GENERATE_SUCCESS`;
const GENERATE_FAILURE = `${prefix}/GENERATE_FAILURE`;

const generateAsync = createAsyncAction(
  GENERATE_REQUEST,
  GENERATE_SUCCESS,
  GENERATE_FAILURE,
)<PlanningConfig, ScheduleSolution, Error>();

const loadLatestAsync = createAsyncAction(
  LOAD_LATEST_REQUEST,
  LOAD_LATEST_SUCCESS,
  LOAD_LATEST_FAILURE,
)<void, PlanningSolution, Error>();

const generate = (config: PlanningConfig) => generateAsync.request(config);

const loadLatest: () => PayloadAction<string, void> = () => loadLatestAsync.request();

function* pollTask() {
  while (true) {
    try {
      // Fetching posts at regular interval 4 seconds.
      const schedule = yield call(apiHelper.get, `${apiPath}/latest`);
      if (schedule) {
        yield put(loadLatestAsync.success(schedule));
        yield put({ type: 'STOP_WATCHER_TASK' });
      }
      yield call(delay, 30000);
    } catch (err) {
      yield put(loadLatestAsync.failure(err));
      // Once the polling has encountered an error,
      // it should be stopped immediately
      yield put({ type: 'STOP_WATCHER_TASK', err });
    }
  }
}
/* Watcher Function */
function* pollTaskWatcher() {
  while (true) {
    yield race([call(pollTask), take('STOP_WATCHER_TASK')])
  }
}

function* generateSaga({ payload }: ReturnType<typeof generateAsync.request>) {
  try {
    // const planning: ScheduleSolution = yield call(apiHelper.get, `${apiPath}/generate`);
    const eventSource = new EventSource(`${apiPath}/generate`);
    const chan = yield call(subSSE, eventSource);
    while (true) {
      const planningSolution: PlanningSolution = yield take(chan);
      yield put(loadLatestAsync.success(planningSolution));
    }
  } catch (e) {
    yield put(generateAsync.failure(e));
  }
}

function subSSE(eventSrc: EventSource) {
  return eventChannel(emitter => {
    eventSrc.onmessage = event => {
      emitter(JSON.parse(event.data));
    };
    eventSrc.onerror = () => {
      emitter(END);
    };
    return () => {
      eventSrc.close();
    }
  });
}

function* loadLatestSaga() {
  try {
    // const planning: ScheduleSolution = yield call(apiHelper.get, `${apiPath}/generate`);
    const eventSource = new EventSource(`${apiPath}/generate`);
    const chan = yield call(subSSE, eventSource);
    while (true) {
      const planningSolution: PlanningSolution = yield take(chan);
      yield put(loadLatestAsync.success(planningSolution));
    }

    // eventSource.onmessage = function (event) {
    //   alert(event.data);
    //   yield put(loadLatestAsync.success(planning));
    //   eventSource.close();
    // };

    // if (Boolean(planning)) {
    //   yield put(loadLatestAsync.success(planning));
    // } else {
    //   yield put(generateAsync.request({ crossoverRate: DEFAULT_CROSSOVER_RATE, mutationRate: DEFAULT_MUTATION_RATE }))
    // }
  } catch (e) {
    yield put(generateAsync.failure(e));
  }
}

function* saga() {
  yield takeLatest('START_WATCHER_TASK', pollTaskWatcher);
  yield takeLatest(LOAD_LATEST_REQUEST, loadLatestSaga);
  yield takeLatest(GENERATE_REQUEST, generateSaga);
  yield call(initialSaga);
}


const reducer = (state: any, action: PayloadAction<string, any> | EmptyAction<string>) => {
  switch (action.type) {
    case GENERATE_REQUEST:
    case LOAD_LATEST_REQUEST: {
      return {
        ...state,
        loading: true,
        error: undefined,
      };
    }
    case GENERATE_SUCCESS:
    case LOAD_LATEST_SUCCESS: {
      const item = (action as PayloadAction<string, Planning>).payload;
      return {
        ...state,
        loading: false,
        item,
        error: undefined,
      };
    }
    case GENERATE_FAILURE:
    case LOAD_LATEST_FAILURE: {
      const payload = (action as PayloadAction<string, Error>).payload;
      return {
        ...state,
        loading: false,
        error: payload.message,
      };
    }

    default:
      return initialReducer(state, action);
  }
};

export { generate, loadLatest, loadItem, loadListIfNeeded, loadList, saveItem, deleteItem, resetItem, saga };
export default reducer;
