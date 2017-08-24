/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
    pages: [{
        name: "home",
        path: "/",
        component: require('./pages/Maps')
    }, {
        name: "maps",
        path: "/maps",
        component: require('./pages/Maps')
    }, {
        name: "mapviewer",
        path: "/viewer/:mapType/:mapId",
        component: require('./pages/MapViewer')
    }, {
        name: "manager",
        path: "/manager",
        component: require('./pages/Manager')
    }, {
        name: "manager",
        path: "/manager/:tool",
        component: require('./pages/Manager')
    }],
    pluginsDef: require('./plugins.js'),
    initialState: {
        defaultState: {
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
            },
            catalog: {
                "selectedService": "",
                "services": {
                    "Basic CSW Service": {
                        "url": "https://demo.geo-solutions.it/geoserver/csw",
                        "type": "csw",
                        "title": "Basic CSW Service"
                    },
                    "Basic WMS Service": {
                        "url": "https://demo.geo-solutions.it/geoserver/wms",
                        "type": "wms",
                        "title": "Basic WMS Service"
                    },
                    "Basic WMTS Service": {
                        "url": "https://demo.geo-solutions.it/geoserver/gwc/service/wmts",
                        "type": "wmts",
                        "title": "Basic WMTS Service"
                    }
                },
                newService: {
                    title: "",
                    type: "wms",
                    url: ""
                }
            }
        },
        mobile: {
            mapInfo: {enabled: true, infoFormat: 'text/html' },
            mousePosition: {enabled: true, crs: "EPSG:4326", showCenter: true}
        }
    },
    storeOpts: {
        persist: {
            whitelist: ['security']
        }
    }
};
