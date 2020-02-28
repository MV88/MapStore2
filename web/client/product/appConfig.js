/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Dashboard from './pages/Dashboard';
import GeoStory from './pages/GeoStory';
import Manager from './pages/Manager';
import MapViewer from './pages/MapViewer';
import Maps from './pages/Maps';
import RulesManager from './pages/RulesManager';

export default {
    pages: [{
        name: "home",
        path: "/",
        component: Maps
    }, {
        name: "maps",
        path: "/maps",
        component: Maps
    }, {
        name: "mapviewer",
        path: "/viewer/:mapType/:mapId",
        component: MapViewer
    }, {
        name: "mapviewer",
        path: "/viewer/:mapId",
        component: MapViewer
    }, {
        name: "manager",
        path: "/manager",
        component: Manager
    }, {
        name: "manager",
        path: "/manager/:tool",
        component: Manager
    }, {
        name: "dashboard",
        path: "/dashboard",
        component: Dashboard
    }, {
        name: "dashboard",
        path: "/dashboard/:did",
        component: Dashboard
    }, {
        name: "rulesmanager",
        path: "/rules-manager",
        component: RulesManager
    }, {
        name: "geostory",
        path: "/geostory/:gid",
        component: GeoStory
    }],
    initialState: {
        defaultState: {
            mousePosition: {enabled: false},
            controls: {
                help: {
                    enabled: false
                },
                details: {
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
                },
                RefreshLayers: {
                    enabled: false,
                    options: {
                        bbox: true,
                        search: true,
                        title: false,
                        dimensions: false
                    }
                },
                cookie: {
                    enabled: false,
                    seeMore: false
                }
            }
        },
        mobile: {
            mapInfo: {enabled: true, infoFormat: 'application/json' },
            mousePosition: {enabled: true, crs: "EPSG:4326", showCenter: true}
        }
    },
    appEpics: {},
    storeOpts: {
        persist: {
            whitelist: ['security']
        }
    }
};
