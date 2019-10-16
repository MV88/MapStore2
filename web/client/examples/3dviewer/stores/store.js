import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import mapConfig from '../../../reducers/config';
import map from '../../../reducers/map';
import locale from '../../../reducers/locale';
import controls from '../reducers/controls';
import mousePosition from '../../../reducers/mousePosition';
import searchResults from '../../../reducers/search';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { searchEpic, searchItemSelected } from '../../../epics/search';

const rootEpic = combineEpics(searchEpic, searchItemSelected);
const epicMiddleware = createEpicMiddleware(rootEpic);

// reducers
const reducers = combineReducers({
    mapConfig,
    map,
    locale,
    searchResults,
    mousePosition,
    controls
});

// compose middleware(s) to createStore
let finalCreateStore = applyMiddleware(thunkMiddleware, epicMiddleware)(createStore);

// export the store with the given reducers (and middleware applied)
module.exports = finalCreateStore(reducers, {});
