import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import runReducer from './reducers/run';
import territoryReducer from './reducers/territory';
import userReducer from './reducers/user';

const rootReducer = combineReducers({
  runs: runReducer,
  territories: territoryReducer,
  user: userReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;
