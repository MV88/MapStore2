/*
* Copyright 2017, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import { get } from 'lodash';

/**
 * selects currentmap state
 * @name currentmap
 * @memberof selectors
 * @static
*/

export const currentMapSelector = (state) => get(state, "currentMap", {});
export const currentMapIdSelector = (state) => get(state, "currentMap.id", "");
export const currentMapNameSelector = (state) => get(state, "currentMap.name", "");
export const currentMapDetailsUriSelector = (state) => get(state, "currentMap.details", "");
export const currentMapDecriptionSelector = (state) => get(state, "currentMap.description", "");
export const currentMapDetailsTextSelector = (state) => get(state, "currentMap.detailsText", "");
export const currentMapThumbnailUriSelector = (state) => get(state, "currentMap.thumbnail", "");
export const currentMapDetailsChangedSelector = (state) => get(state, "currentMap.detailsChanged", false);
export const currentMapOriginalDetailsTextSelector = (state) => get(state, "currentMap.originalDetails", false);
