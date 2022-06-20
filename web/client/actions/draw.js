/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

export const CHANGE_DRAWING_STATUS = 'CHANGE_DRAWING_STATUS';
export const END_DRAWING = 'DRAW:END_DRAWING';
export const SET_CURRENT_STYLE = 'DRAW:SET_CURRENT_STYLE';
export const GEOMETRY_CHANGED = 'DRAW:GEOMETRY_CHANGED';
export const DRAW_SUPPORT_STOPPED = 'DRAW:DRAW_SUPPORT_STOPPED';
export const FEATURES_SELECTED = 'DRAW:FEATURES_SELECTED';
export const DRAWING_FEATURE = 'DRAW:DRAWING_FEATURES';
export const SET_SNAPPING_LAYER = 'DRAW:SET_SNAPPING_LAYER';
export const SNAPPING_IS_LOADING = 'DRAW:SNAPPING_IS_LOADING';
export const TOGGLE_SNAPPING = 'DRAW:TOGGLE_SNAPPING';
export const SET_SNAPPING_CONFIG = 'DRAW:SET_SNAPPING_CONFIG';

import  { normalizeLng } from '../../client/utils/CoordinatesUtils';

export function geometryChanged(features, owner, enableEdit, textChanged, circleChanged) {
    let newCoords = [];
    if (features[0].geometry.type === 'Point') {
        newCoords = [normalizeLng(features[0].geometry.coordinates[0]), features[0].geometry.coordinates[1]];

    } else if (features[0].geometry.type === 'LineString' || features[0].geometry.type === 'MultiPoint') {
        newCoords = features[0].geometry.coordinates.map((item) => [normalizeLng(item[0]), item[1]]);

    } else if (features[0].geometry.type === 'Polygon' || features[0].geometry.type === 'MultiLineString' ) {
        newCoords = features[0].geometry.coordinates.map(x => x.map((item) => [normalizeLng(item[0]), item[1]]));

    } else if (features[0].geometry.type === 'MultiPolygon') {
        newCoords = features[0].geometry.coordinates.map(i => i.map(x => x.map((item) => [normalizeLng(item[0]), item[1]])));

    }
    features[0].geometry.coordinates = newCoords;

    return {
        type: GEOMETRY_CHANGED,
        features,
        owner,
        enableEdit,
        textChanged,
        circleChanged
    };
}
/** used to manage the selected features
 * @param {object[]} features geojson
*/
export function selectFeatures(features = []) {
    return {
        type: FEATURES_SELECTED,
        features
    };
}
export function drawingFeatures(features = []) {
    return {
        type: DRAWING_FEATURE,
        features
    };
}
export function drawStopped() {
    return {
        type: DRAW_SUPPORT_STOPPED
    };
}

export function changeDrawingStatus(status, method, owner, features, options, style) {
    return {
        type: CHANGE_DRAWING_STATUS,
        status,
        method,
        owner,
        features,
        options,
        style
    };
}


export function endDrawing(geometry, owner) {
    return {
        type: END_DRAWING,
        geometry,
        owner
    };
}

export function setCurrentStyle(style) {
    return {
        type: SET_CURRENT_STYLE,
        currentStyle: style
    };
}

export const drawSupportReset = (owner) => changeDrawingStatus("clean", "", owner, [], {});

export function toggleSnapping() {
    return {
        type: TOGGLE_SNAPPING
    };
}

export function setSnappingLayer(snappingLayer) {
    return {
        type: SET_SNAPPING_LAYER,
        snappingLayer
    };
}

export function toggleSnappingIsLoading() {
    return {
        type: SNAPPING_IS_LOADING
    };
}

export function setSnappingConfig(value, prop, pluginCfg) {
    return {
        type: SET_SNAPPING_CONFIG,
        value,
        prop,
        pluginCfg
    };
}

