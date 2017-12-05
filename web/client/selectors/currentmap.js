/*
* Copyright 2017, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

const {get} = require('lodash');

/**
 * selects currentmap state
 * @name currentmap
 * @memberof selectors
 * @static
 */

const currentMapDetailsSelector = (state) => get(state, "currentMap.detailsText", "");
const currentMapDetailsUriSelector = (state) => get(state, "currentMap.details", "");
const currentMapIdSelector = (state) => get(state, "currentMap.id", "");
const currentMapSelector = (state) => get(state, "currentMap", "");
const currentMapNameSelector = (state) => get(state, "currentMap.name", "");
const currentMapDecriptionSelector = (state) => get(state, "currentMap.description", "");
const currentMapDetailsChangedSelector = (state) => get(state, "currentMap.detailsChanged", "");
module.exports = {
    currentMapDetailsChangedSelector,
    currentMapDetailsSelector,
    currentMapDetailsUriSelector,
    currentMapSelector,
    currentMapIdSelector,
    currentMapNameSelector,
    currentMapDecriptionSelector
};
