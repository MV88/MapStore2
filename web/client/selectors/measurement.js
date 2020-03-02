/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import { showCoordinateEditorSelector } from '../selectors/controls';
import { isOpenlayers } from '../selectors/maptype';
import { set } from '../utils/ImmutableUtils';
import { validateFeatureCoordinates } from '../utils/MeasureUtils';

/**
 * selects measurement state
 * @name measurement
 * @memberof selectors
 * @static
 */

/**
 * selects the showCoordinateEditor flag from state
 * @memberof selectors.measurement
 * @param  {object} state the state
 * @return {boolean} the showCoordinateEditor in the state
 */
export const isCoordinateEditorEnabledSelector = (state) => showCoordinateEditorSelector(state) && !state.measurement.isDrawing && isOpenlayers(state);
export const showAddAsAnnotationSelector = (state) => state && state.measurement && state.measurement.showAddAsAnnotation;

/**
 * validating feature that can contain invalid coordinates
 * polygons needs to be closed fro being drawing
 * if the number of valid coords is < min for that geomType then
 * return empty coordinates
*/
export const getValidFeatureSelector = (state) => {
    let feature = state.measurement.feature || {};
    if (feature.geometry) {
        feature = set("geometry.coordinates", validateFeatureCoordinates(feature.geometry || {}), feature);
    }
    return feature;
};

export const measurementSelector = (state) => {
    return state.measurement && {
        ...state.measurement,
        feature: getValidFeatureSelector(state)
    } || {};
};

