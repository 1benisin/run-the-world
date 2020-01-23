import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import runReducer from './run/reducer';
import territoryReducer from './territory/reducer';
import userReducer from './user/reducer';

const rootReducer = combineReducers({
  runs: runReducer,
  territories: territoryReducer,
  user: userReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;
