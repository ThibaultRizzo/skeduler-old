import { applyMiddleware, combineReducers, compose, createStore, Middleware, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();

// prettier-ignore
// @ts-ignore
const devtools = window['__REDUX_DEVTOOLS_EXTENSION__'] ? window['__REDUX_DEVTOOLS_EXTENSION__']() : f => f;

const configureStore = (): Store => {
  const middlewares: Middleware[] = [sagaMiddleware];
  // if (process.env.NODE_ENV === 'development') {
  //   middlewares.push(loggerMiddleware);
  // }

  const rootReducer = combineReducers(reducers);
  const enhancers = [applyMiddleware(...middlewares), devtools];
  const store: Store = createStore(rootReducer, {}, compose(...enhancers));

  if (module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(combineReducers(reducers)));
  }

  sagas.map(sagaMiddleware.run);

  return store;
};

export default configureStore();
