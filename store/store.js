import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import runReducer from './reducers/run';
import territoryReducer from './reducers/territory';

const rootReducer = combineReducers({
  runs: runReducer,
  territories: territoryReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;
