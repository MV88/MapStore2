/*
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import { error } from './notifications';

export const CHANGE_MAP_VIEW = 'CHANGE_MAP_VIEW';
export const CLICK_ON_MAP = 'CLICK_ON_MAP';
export const CHANGE_MOUSE_POINTER = 'CHANGE_MOUSE_POINTER';
export const CHANGE_ZOOM_LVL = 'CHANGE_ZOOM_LVL';
export const PAN_TO = 'PAN_TO';
export const ZOOM_TO_EXTENT = 'ZOOM_TO_EXTENT';
export const ZOOM_TO_POINT = 'ZOOM_TO_POINT';
export const CHANGE_MAP_CRS = 'CHANGE_MAP_CRS';
export const CHANGE_MAP_SCALES = 'CHANGE_MAP_SCALES';
export const CHANGE_MAP_STYLE = 'CHANGE_MAP_STYLE';
export const CHANGE_ROTATION = 'CHANGE_ROTATION';
export const CREATION_ERROR_LAYER = 'CREATION_ERROR_LAYER';
export const UPDATE_VERSION = 'UPDATE_VERSION';
export const INIT_MAP = 'INIT_MAP';
export const RESIZE_MAP = 'RESIZE_MAP';
export const CHANGE_MAP_LIMITS = 'CHANGE_MAP_LIMITS';
export const SET_MAP_RESOLUTIONS = 'SET_MAP_RESOLUTIONS';
export const CHECK_MAP_CHANGES = 'CHECK_MAP_CHANGES';

export function errorLoadingFont(err = {family: ""}) {
    return error({
        title: "warning",
        message: "map.errorLoadingFont",
        values: err,
        position: "tc",
        autoDismiss: 10
    });
}

/**
 * zoom to a specific point
 * @memberof actions.map
 * @param {object} pos as array [x, y] or object {x: ..., y:...}
 * @param {number} zoom level to zoom to
 * @param {string} crs of the point
*/
export function zoomToPoint(pos, zoom, crs) {
    return {
        type: ZOOM_TO_POINT,
        pos,
        zoom,
        crs
    };
}

export function changeMapView(center, zoom, bbox, size, mapStateSource, projection, viewerOptions) {
    return {
        type: CHANGE_MAP_VIEW,
        center,
        zoom,
        bbox,
        size,
        mapStateSource,
        projection,
        viewerOptions
    };
}

export function changeMapCrs(crs) {
    return {
        type: CHANGE_MAP_CRS,
        crs: crs
    };
}

export function changeMapScales(scales) {
    return {
        type: CHANGE_MAP_SCALES,
        scales: scales
    };
}

export function clickOnMap(point, layer) {
    return {
        type: CLICK_ON_MAP,
        point: point,
        layer
    };
}

export function changeMousePointer(pointerType) {
    return {
        type: CHANGE_MOUSE_POINTER,
        pointer: pointerType
    };
}

export function changeZoomLevel(zoomLvl, mapStateSource) {
    return {
        type: CHANGE_ZOOM_LVL,
        zoom: zoomLvl,
        mapStateSource: mapStateSource
    };
}


/**
 * pan to a specific point
 * @memberof actions.map
 * @param {object} center as {x, y, crs}
*/
export function panTo(center) {
    return {
        type: PAN_TO,
        center
    };
}

/**
 * zoom to the specified extent
 * @memberof actions.map
 * @param {number[]} extent in the form of [minx, miny, maxx, maxy]
 * @param {string} crs related the extent
 * @param {number} maxZoom the max zoom limit
*/
export function zoomToExtent(extent, crs, maxZoom) {
    return {
        type: ZOOM_TO_EXTENT,
        extent,
        crs,
        maxZoom
    };
}

export function changeRotation(rotation, mapStateSource) {
    return {
        type: CHANGE_ROTATION,
        rotation,
        mapStateSource
    };
}

export function changeMapStyle(style, mapStateSource) {
    return {
        type: CHANGE_MAP_STYLE,
        style,
        mapStateSource
    };
}
export function updateVersion(version) {
    return {
        type: UPDATE_VERSION,
        version
    };
}

export function initMap(disableFeedbackMask) {
    return {
        type: INIT_MAP,
        disableFeedbackMask
    };
}

export function resizeMap() {
    return {
        type: RESIZE_MAP
    };
}
export function changeMapLimits({restrictedExtent, crs, minZoom}) {
    return {
        type: CHANGE_MAP_LIMITS,
        restrictedExtent,
        crs,
        minZoom
    };
}

export function setMapResolutions(resolutions) {
    return {
        type: SET_MAP_RESOLUTIONS,
        resolutions
    };
}

export const checkMapChanges = (action, source) => ({
    type: CHECK_MAP_CHANGES,
    action,
    source
});

/**
 * Actions for map
 * @name actions.map
*/
