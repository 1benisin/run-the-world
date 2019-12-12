import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import runReducer from './reducers/run';

const rootReducer = combineReducers({
  runs: runReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;
