/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import url from 'url';

import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

const urlQuery = url.parse(window.location.href, true).query;
/* eslint-disable */
var warn = console.warn;
/* eslint-enable */

var warningFilterKey = function(warning) {
    // avoid React 0.13.x warning about nested context. Will remove in 0.14
    return warning.indexOf("Warning: owner-based and parent-based contexts differ") >= 0;
};

export const createDebugStore =  async(reducer, initialState, userMiddlewares, enhancer) => {
    let finalCreateStore;
    if (urlQuery && urlQuery.debug && __DEVTOOLS__) {
        let logger = await import('redux-logger');
        let immutable = await import('redux-immutable-state-invariant').default();
        let middlewares = [immutable, thunkMiddleware, logger].concat(userMiddlewares || []);
        const {persistState} = await import('redux-devtools');
        const DevTools = await import('../components/development/DevTools');

        finalCreateStore = compose(
            applyMiddleware.apply(null, middlewares),
            persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
            window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument()

        )(createStore);
    } else {
        let middlewares = [thunkMiddleware].concat(userMiddlewares || []);
        finalCreateStore = applyMiddleware.apply(null, middlewares)(createStore);
    }
    return finalCreateStore(reducer, initialState, enhancer);
};


var DebugUtils = {
    createDebugStore
};
/* eslint-disable */
console.warn = function() {
    if ( arguments && arguments.length > 0 && typeof arguments[0] === "string" && warningFilterKey(arguments[0]) ) {
        // do not warn
    } else {
        warn.apply(console, arguments);
    }
};
/* eslint-enable */

export default DebugUtils;
