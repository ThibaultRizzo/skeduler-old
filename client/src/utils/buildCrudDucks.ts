import { ActionType, createAsyncAction, createAction, getType } from 'typesafe-actions';
import { call, put, select, takeLeading, takeEvery, takeLatest } from 'redux-saga/effects';
import { AsyncItemLoadRequest, AsyncItemSaveRequest, AsyncItemDeleteRequest, ItemSaveRequest, ResolveFunction, RejectFunction, Identified } from './ducks';
import apiHelper from '../api/apiHelper';
import { RootState } from '../config/reducers';

export interface ListState<T> {
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly error?: string;
  readonly list: T[];
  readonly item?: T;
}

export interface SaveAction<T> {
  creationMode: boolean;
  item: T;
}

export const buildTestableCrudDucks = <T extends Identified>(
  scope: string,
  apiPath: string,
  selectList: (state: any) => ListState<T>,
  sortFn?: (a: T, b: T) => number,
) => {
  /* **********************
   * TYPES
   * **********************/

  /* **********************
   * ACTIONS
   * **********************/
  const LOAD_LIST_REQUEST = `${scope}/LOAD_LIST_REQUEST`;
  const LOAD_LIST_SUCCESS = `${scope}/LOAD_LIST_SUCCESS`;
  const LOAD_LIST_FAILURE = `${scope}/LOAD_LIST_FAILURE`;

  const LOAD_REQUEST = `${scope}/LOAD_REQUEST`;
  const LOAD_SUCCESS = `${scope}/LOAD_SUCCESS`;
  const LOAD_FAILURE = `${scope}/LOAD_FAILURE`;

  const SAVE_REQUEST = `${scope}/SAVE_REQUEST`;
  const SAVE_SUCCESS = `${scope}/SAVE_SUCCESS`;
  const SAVE_FAILURE = `${scope}/SAVE_FAILURE`;

  const DELETE_REQUEST = `${scope}/DELETE_REQUEST`;
  const DELETE_SUCCESS = `${scope}/DELETE_SUCCESS`;
  const DELETE_FAILURE = `${scope}/DELETE_FAILURE`;

  const LOAD_LIST_IF_NEEDED = `${scope}/LOAD_LIST_IF_NEEDED`;
  const RESET_ITEM = `${scope}/RESET_ITEM`;

  /* **********************
   * ACTION CREATORS
   * **********************/

  const loadAsync = createAsyncAction(LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE)<
    AsyncItemLoadRequest<T>,
    T,
    Error
  >();

  const loadListAsync = createAsyncAction(LOAD_LIST_REQUEST, LOAD_LIST_SUCCESS, LOAD_LIST_FAILURE)<void, T[], Error>();


  const saveAsync = createAsyncAction(SAVE_REQUEST, SAVE_SUCCESS, SAVE_FAILURE)<
    AsyncItemSaveRequest<T>,
    SaveAction<T>,
    Error
  >();

  const deleteAsync = createAsyncAction(DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE)<
    AsyncItemDeleteRequest,
    number,
    Error
  >();

  const loadListIfNeeded = createAction(LOAD_LIST_IF_NEEDED)();

  const resetItem = createAction(RESET_ITEM)();

  const loadItem = (
    id: number,
    resolve?: ResolveFunction<T>,
    reject?: RejectFunction
  ) => loadAsync.request({ id, resolve, reject });

  const loadList = () => loadListAsync.request();

  const saveItem = (
    { item, creationMode }: ItemSaveRequest<T>,
    resolve?: ResolveFunction<T>,
    reject?: RejectFunction,
  ) => {
    return saveAsync.request({ item, creationMode, resolve, reject });
  };

  const deleteItem = (
    id: number,
    resolve?: ResolveFunction<number | null>,
    reject?: RejectFunction,
  ) => {
    return deleteAsync.request({ id, resolve, reject });
  };


  const listActions = { loadAsync, loadListAsync, loadListIfNeeded, resetItem, saveAsync, deleteAsync };

  type ListAction = ActionType<typeof listActions>;

  /* **********************
   * SAGAS
   * **********************/

  function* loadSaga({ payload: { id, resolve, reject } }: ReturnType<typeof loadAsync.request>) {
    try {
      const item: T | null = yield call(apiHelper.get, `${apiPath}/${id}`);
      if (item === null) {
        throw new Error(`Le numéro suivant ne correspond à aucun element existant: ${id}`);
      }
      yield put(loadAsync.success(item as any, item as any));
      if (resolve) {
        yield call(resolve, item);
      }
    } catch (e) {
      yield put(loadAsync.failure(e));
      if (reject) {
        yield call(reject, e);
      }
    }
  }

  function* saveSaga({
    payload: { item, creationMode, resolve, reject },
  }: ReturnType<typeof saveAsync.request>) {
    try {
      const body: T = creationMode
        ? yield call(apiHelper.postJson, apiPath, item)
        : yield call(apiHelper.putJson, `${apiPath}/${item.id}`, item);
      yield put(saveAsync.success({ creationMode, item: body }));
      if (resolve) {
        yield call(resolve, body);
      }
    } catch (e) {
      yield put(saveAsync.failure(e));
      if (reject) {
        yield call(reject, e);
      }
    }
  }

  function* deleteSaga({
    payload: { id, resolve, reject },
  }: ReturnType<typeof deleteAsync.request>) {
    try {
      const result = yield call(apiHelper.delete, `${apiPath}/${id}`);
      yield put(deleteAsync.success(id));
      if (resolve) {
        yield call(resolve, result);
      }
    } catch (e) {
      yield put(deleteAsync.failure(e));
      if (reject) {
        yield call(reject, e);
      }
    }
  }

  function* loadListSaga() {
    try {
      const body: T[] = yield call(apiHelper.get, apiPath);
      sortFn && body.sort(sortFn);
      yield put(loadListAsync.success(body));
    } catch (e) {
      yield put(loadListAsync.failure(e));
    }
  }

  function* loadListIfNeededSaga() {
    const { loading, loaded } = yield select(selectList);
    if (!loaded && !loading) {
      yield put(loadList());
    }
  }

  function* saga() {
    yield takeLatest(LOAD_REQUEST, loadSaga);
    yield takeLatest(LOAD_LIST_REQUEST, loadListSaga);
    yield takeLatest(SAVE_REQUEST, saveSaga);
    yield takeLeading(DELETE_REQUEST, deleteSaga);
    yield takeEvery(LOAD_LIST_IF_NEEDED, loadListIfNeededSaga);
  }

  /* **********************
   * REDUCER
   * **********************/

  const initialState: ListState<T> = {
    loading: false,
    loaded: false,
    error: undefined,
    list: [],
    item: undefined
  };

  type actionType = any;//PayloadAction<string, any> | EmptyAction<string>;

  const reducer = (state: ListState<T> = initialState, action: actionType): ListState<T> => {
    switch (action.type) {
      case getType(loadAsync.request):
      case getType(loadListAsync.request):
      case getType(saveAsync.request):
      case getType(deleteAsync.request): {
        return {
          ...state,
          loading: true,
          loaded: false,
          error: undefined,
        };
      }
      case getType(loadAsync.success):
      case getType(saveAsync.success): {
        const { item, creationMode } = action.payload as SaveAction<T>;
        const list = creationMode ? [...state.list, item] : [...state.list.filter(i => i.id !== item.id), item];
        return {
          ...state,
          loading: false,
          loaded: true,
          error: undefined,
          item,
          list
        };
      }
      case getType(loadListAsync.success): {
        const list = action.payload as T[];
        return {
          ...state,
          loading: false,
          loaded: true,
          error: undefined,
          list,
        };
      }
      case getType(deleteAsync.success): {
        const id = action.payload;
        return {
          ...state,
          loading: false,
          loaded: true,
          error: undefined,
          list: state.list.filter(item => item.id !== id),
        };
      }
      case getType(loadAsync.failure):
      case getType(loadListAsync.failure):
      case getType(saveAsync.failure):
      case getType(deleteAsync.failure): {
        const payload = action.payload as Error;
        return {
          ...state,
          loading: false,
          error: payload.message,
        };
      }
      case getType(resetItem): {
        return {
          ...state,
          item: undefined
        };
      }
      default:
        return state;
    }
  };

  return {
    loadItem,
    loadList,
    loadListIfNeeded,
    saveItem,
    deleteItem,
    resetItem,
    saga,
    reducer,
  };
};

const buildCrudDucks = <T extends Identified>(
  scope: string,
  apiPath: string,
  selectList: (state: RootState) => ListState<T>,
  sortFn?: (a: T, b: T) => number,
) => {
  return buildTestableCrudDucks<T>(
    scope,
    apiPath,
    selectList,
    sortFn,
  );
};

export default buildCrudDucks;
