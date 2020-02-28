import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import mapConfig from '../../../reducers/config';

// reducers
const reducers = combineReducers({
    mapConfig
});

// compose middleware(s) to createStore
let finalCreateStore = applyMiddleware(thunkMiddleware)(createStore);

// export the store with the given reducers (and middleware applied)
export default finalCreateStore(reducers, {});
