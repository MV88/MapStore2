/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
export const CHANGE_MEASUREMENT_TOOL = 'CHANGE_MEASUREMENT_TOOL';
export const CHANGE_MEASUREMENT_STATE = 'CHANGE_MEASUREMENT_STATE';
export const CHANGE_UOM = 'MEASUREMENT:CHANGE_UOM';
export const CHANGED_GEOMETRY = 'MEASUREMENT:CHANGED_GEOMETRY';
export const RESET_GEOMETRY = 'MEASUREMENT:RESET_GEOMETRY';
export const CHANGE_FORMAT = 'MEASUREMENT:CHANGE_FORMAT';
export const CHANGE_COORDINATES = 'MEASUREMENT:CHANGE_COORDINATES';
export const ADD_MEASURE_AS_ANNOTATION = 'MEASUREMENT:ADD_MEASURE_AS_ANNOTATION';
export const UPDATE_MEASURES = 'MEASUREMENT:UPDATE_MEASURES';
export const INIT = 'MEASUREMENT:INIT';

/**
 * trigger the epic to add the measure feature into an annotation.
*/
export function addAnnotation(feature, value, uom, measureTool) {
    return {
        type: ADD_MEASURE_AS_ANNOTATION,
        feature,
        value,
        uom,
        measureTool
    };
}

// TODO: the measurement control should use the "controls" state
export function toggleMeasurement(measurement) {
    return {
        type: CHANGE_MEASUREMENT_TOOL,
        ...measurement
    };
}

export function changeMeasurement(measurement) {
    return (dispatch) => {
        dispatch(toggleMeasurement(measurement));
    };
}

/**
 * @param {string} uom length or area
 * @param {string} value unit of uom
 * @param {object} previous uom object
*/
export function changeUom(uom, value, previousUom) {
    return {
        type: CHANGE_UOM,
        uom,
        value,
        previousUom
    };
}

export function changeGeometry(feature) {
    return {
        type: CHANGED_GEOMETRY,
        feature
    };
}
export function changeFormatMeasurement(format) {
    return {
        type: CHANGE_FORMAT,
        format
    };
}
export function changeCoordinates(coordinates) {
    return {
        type: CHANGE_COORDINATES,
        coordinates
    };
}
export function resetGeometry() {
    return {
        type: RESET_GEOMETRY
    };
}
export function updateMeasures(measures) {
    return {
        type: UPDATE_MEASURES,
        measures
    };
}
export function changeMeasurementState(measureState) {
    return {
        type: CHANGE_MEASUREMENT_STATE,
        pointMeasureEnabled: measureState.pointMeasureEnabled,
        lineMeasureEnabled: measureState.lineMeasureEnabled,
        areaMeasureEnabled: measureState.areaMeasureEnabled,
        bearingMeasureEnabled: measureState.bearingMeasureEnabled,
        geomType: measureState.geomType,
        point: measureState.point,
        len: measureState.len,
        area: measureState.area,
        bearing: measureState.bearing,
        lenUnit: measureState.lenUnit,
        areaUnit: measureState.areaUnit,
        feature: measureState.feature
    };
}
export function init(defaultOptions = {}) {
    return {
        type: INIT,
        defaultOptions
    };
}
