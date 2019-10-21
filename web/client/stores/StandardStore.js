/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import assign from 'object-assign';

import { mapConfigHistory, createHistory } from '../utils/MapHistoryUtils';

const map = mapConfigHistory(require('../reducers/map'));

import layers from '../reducers/layers';
import mapConfig from '../reducers/config';
import DebugUtils from '../utils/DebugUtils';
import { combineReducers, combineEpics } from '../utils/PluginsUtils';
import LayersUtils from '../utils/LayersUtils';
import { CHANGE_BROWSER_PROPERTIES } from '../actions/browser';
import { createEpicMiddleware } from 'redux-observable';
import SecurityUtils from '../utils/SecurityUtils';
import ListenerEnhancer from '@carnesen/redux-add-action-listener-enhancer';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import layersEpics from '../epics/layers';
import controlsEpics from '../epics/controls';
import timeManagerEpics from '../epics/dimension';
const standardEpics = {
    ...layersEpics,
    ...controlsEpics,
    ...timeManagerEpics
};

export default (initialState = {defaultState: {}, mobile: {}}, appReducers = {}, appEpics = {}, plugins = {}, storeOpts = {}) => {
    const history = storeOpts.noRouter ? null : require('./History').default;
    const allReducers = combineReducers(plugins, {
        ...appReducers,
        localConfig: require('../reducers/localConfig'),
        locale: require('../reducers/locale'),
        locales: () => {return null; },
        browser: require('../reducers/browser'),
        controls: require('../reducers/controls'),
        theme: require('../reducers/theme'),
        help: require('../reducers/help'),
        map: () => {return null; },
        mapInitialConfig: () => {return null; },
        layers: () => {return null; },
        router: storeOpts.noRouter ? undefined : connectRouter(history)
    });
    const rootEpic = combineEpics(plugins, {...appEpics, ...standardEpics});
    const optsState = storeOpts.initialState || {defaultState: {}, mobile: {}};
    const defaultState = assign({}, initialState.defaultState, optsState.defaultState);
    const mobileOverride = assign({}, initialState.mobile, optsState.mobile);
    const epicMiddleware = createEpicMiddleware(rootEpic);
    const rootReducer = (state, action) => {
        let mapState = createHistory(LayersUtils.splitMapAndLayers(mapConfig(state, action)));
        let newState = {
            ...allReducers(state, action),
            map: mapState && mapState.map ? map(mapState.map, action) : null,
            mapInitialConfig: mapState && mapState.mapInitialConfig || mapState && mapState.loadingError && {
                loadingError: mapState.loadingError,
                mapId: mapState.loadingError.mapId
            } || null,
            layers: mapState ? layers(mapState.layers, action) : null
        };
        if (action && action.type === CHANGE_BROWSER_PROPERTIES && newState.browser.mobile) {
            newState = assign(newState, mobileOverride);
        }

        return newState;
    };
    let store;
    let enhancer;
    if (storeOpts && storeOpts.notify) {
        enhancer = ListenerEnhancer;
    }
    if (storeOpts && storeOpts.persist) {
        storeOpts.persist.whitelist.forEach((fragment) => {
            const fragmentState = localStorage.getItem('mapstore2.persist.' + fragment);
            if (fragmentState) {
                defaultState[fragment] = JSON.parse(fragmentState);
            }
        });
        if (storeOpts.onPersist) {
            setTimeout(() => {storeOpts.onPersist(); }, 0);
        }
    }

    let middlewares = [epicMiddleware];
    if (!storeOpts.noRouter) {
        // Build the middleware for intercepting and dispatching navigation actions
        const reduxRouterMiddleware = routerMiddleware(history);
        middlewares = [...middlewares, reduxRouterMiddleware];
    }

    store = DebugUtils.createDebugStore(rootReducer, defaultState, middlewares, enhancer);
    if (storeOpts && storeOpts.persist) {
        const persisted = {};
        store.subscribe(() => {
            storeOpts.persist.whitelist.forEach((fragment) => {
                const fragmentState = store.getState()[fragment];
                if (fragmentState && persisted[fragment] !== fragmentState) {
                    persisted[fragment] = fragmentState;
                    localStorage.setItem('mapstore2.persist.' + fragment, JSON.stringify(fragmentState));
                }
            });
        });
    }
    SecurityUtils.setStore(store);
    return store;
};
