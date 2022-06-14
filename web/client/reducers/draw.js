/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import {
    CHANGE_DRAWING_STATUS,
    SET_CURRENT_STYLE,
    GEOMETRY_CHANGED,
    DRAW_SUPPORT_STOPPED,
    TOGGLE_SNAPPING,
    SET_SNAPPING_LAYER,
    SNAPPING_IS_LOADING,
    SET_SNAPPING_CONFIG
} from '../actions/draw';
import  { normalizeLng } from '../../client/utils/CoordinatesUtils';

import assign from 'object-assign';

const initialState = {
    drawStatus: null,
    drawOwner: null,
    drawMethod: null,
    options: {},
    features: [],
    tempFeatures: [],
    snapping: false,
    snappingIsLoading: false,
    snappingLayer: false
};

export const defaultSnappingConfig = { edge: true, vertex: true, pixelTolerance: 10, strategy: 'bbox'};

function draw(state = initialState, action) {
    switch (action.type) {
    case CHANGE_DRAWING_STATUS:
        return assign({}, state, {
            drawStatus: action.status,
            drawOwner: action.owner,
            drawMethod: action.method,
            options: action.options,
            features: action.features,
            style: action.style
        });
    case SET_CURRENT_STYLE:
        return assign({}, state, {
            currentStyle: action.currentStyle
        });
    case GEOMETRY_CHANGED:
        let newData = action.features;
        const polygonList = ['MultiLineString','MultiPolygon', 'MultiPoint', 'Polygon', 'LineString','Point' ]
        if (polygonList.includes(newData[0].geometry.type)){
            const normalizedData = newData[0].geometry.coordinates.map(i => i.map(x => x.map((item) => [normalizeLng(item[0]), item[1]])));
            newData[0].geometry.coordinates = normalizedData;
        }
        return assign({}, state, {tempFeatures: newData});
    case DRAW_SUPPORT_STOPPED:
        return assign({}, state, {tempFeatures: []});
    case TOGGLE_SNAPPING:
        return {
            ...state,
            snapping: !state.snapping
        };
    case SET_SNAPPING_LAYER:
        return {
            ...state,
            snappingLayer: action.snappingLayer,
            snappingIsLoading: false
        };
    case SNAPPING_IS_LOADING:
        return {
            ...state,
            snappingIsLoading: !state.snappingIsLoading
        };
    case SET_SNAPPING_CONFIG:
        return {
            ...state,
            snapConfig: {
                ...({...defaultSnappingConfig, ...(action.pluginCfg?.snapConfig || {})}),
                ...(state?.snapConfig ?? {}),
                ...(action.prop && typeof action.value !== 'undefined' ? {[action.prop]: action.value} : {})
            }
        };
    default:
        return state;
    }
}

export default draw;
