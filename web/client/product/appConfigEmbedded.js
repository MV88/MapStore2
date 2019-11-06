/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import { updateMapLayoutEpic } from '../epics/maplayout';
import { readQueryParamsOnMapEpic } from '../epics/queryparams';
import maplayout from '../reducers/maplayout';
import searchconfig from '../reducers/searchconfig';
import version from '../reducers/version';
import apiPlugins from './apiPlugins.js';
import MapViewer from './pages/MapViewer';


export const mode = "embedded";
export const pages = [{
    name: "mapviewer",
    path: "/:mapId",
    component: MapViewer
}];
export const pluginsDef = apiPlugins;
export const initialState = {
    defaultState: {
        mode: "embedded",
        mousePosition: {enabled: false},
        controls: {
            help: {
                enabled: false
            },
            print: {
                enabled: false
            },
            toolbar: {
                active: null,
                expanded: false
            },
            drawer: {
                enabled: false,
                menu: "1"
            }
        },
        mapInfo: {enabled: true, infoFormat: 'text/html' }
    },
    mobile: {
    }
};
export const baseReducers = {
    mode: (state = 'embedded') => state,
    version,
    maplayout,
    searchconfig
};
export const baseEpics = {
    updateMapLayoutEpic,
    readQueryParamsOnMapEpic
};
export const storeOpts = {
    persist: {
        whitelist: ['security']
    }
};

export default {
    mode,
    pages,
    pluginsDef,
    initialState,
    baseReducers,
    baseEpics,
    storeOpts
};
