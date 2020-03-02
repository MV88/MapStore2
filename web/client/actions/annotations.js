/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import { head } from 'lodash';

export const EDIT_ANNOTATION = 'ANNOTATIONS:EDIT';
export const OPEN_EDITOR = 'ANNOTATIONS:OPEN_EDITOR';
export const SHOW_ANNOTATION = 'ANNOTATIONS:SHOW';
export const NEW_ANNOTATION = 'ANNOTATIONS:NEW';
export const REMOVE_ANNOTATION = 'ANNOTATIONS:REMOVE';
export const REMOVE_ANNOTATION_GEOMETRY = 'ANNOTATIONS:REMOVE_GEOMETRY';
export const CONFIRM_REMOVE_ANNOTATION = 'ANNOTATIONS:CONFIRM_REMOVE';
export const CANCEL_REMOVE_ANNOTATION = 'ANNOTATIONS:CANCEL_REMOVE';
export const CANCEL_EDIT_ANNOTATION = 'ANNOTATIONS:CANCEL_EDIT';
export const CANCEL_SHOW_ANNOTATION = 'ANNOTATIONS:CANCEL_SHOW';
export const SAVE_ANNOTATION = 'ANNOTATIONS:SAVE';
export const TOGGLE_ADD = 'ANNOTATIONS:TOGGLE_ADD';
export const TOGGLE_STYLE = 'ANNOTATIONS:TOGGLE_STYLE';
export const SET_STYLE = 'ANNOTATIONS:SET_STYLE';
export const RESTORE_STYLE = 'ANNOTATIONS:RESTORE_STYLE';
export const UPDATE_ANNOTATION_GEOMETRY = 'ANNOTATIONS:UPDATE_GEOMETRY';
export const SET_INVALID_SELECTED = 'ANNOTATIONS:SET_INVALID_SELECTED';
export const VALIDATION_ERROR = 'ANNOTATIONS:VALIDATION_ERROR';
export const HIGHLIGHT = 'ANNOTATIONS:HIGHLIGHT';
export const CLEAN_HIGHLIGHT = 'ANNOTATIONS:CLEAN_HIGHLIGHT';
export const FILTER_ANNOTATIONS = 'ANNOTATIONS:FILTER';
export const CLOSE_ANNOTATIONS = 'ANNOTATIONS:CLOSE';
export const CONFIRM_CLOSE_ANNOTATIONS = 'ANNOTATIONS:CONFIRM_CLOSE';
export const CANCEL_CLOSE_ANNOTATIONS = 'ANNOTATIONS:CANCEL_CLOSE';
export const START_DRAWING = 'ANNOTATIONS:START_DRAWING';
export const UNSAVED_CHANGES = 'ANNOTATIONS:UNSAVED_CHANGES';
export const TOGGLE_CHANGES_MODAL = 'ANNOTATIONS:TOGGLE_CHANGES_MODAL';
export const TOGGLE_GEOMETRY_MODAL = 'ANNOTATIONS:TOGGLE_GEOMETRY_MODAL';
export const CHANGED_PROPERTIES = 'ANNOTATIONS:CHANGED_PROPERTIES';
export const UNSAVED_STYLE = 'ANNOTATIONS:UNSAVED_STYLE';
export const TOGGLE_STYLE_MODAL = 'ANNOTATIONS:TOGGLE_STYLE_MODAL';
export const ADD_TEXT = 'ANNOTATIONS:ADD_TEXT';
export const DOWNLOAD = 'ANNOTATIONS:DOWNLOAD';
export const LOAD_ANNOTATIONS = 'ANNOTATIONS:LOAD_ANNOTATIONS';
export const CHANGED_SELECTED = 'ANNOTATIONS:CHANGED_SELECTED';
export const RESET_COORD_EDITOR = 'ANNOTATIONS:RESET_COORD_EDITOR';
export const CHANGE_RADIUS = 'ANNOTATIONS:CHANGE_RADIUS';
export const CHANGE_TEXT = 'ANNOTATIONS:CHANGE_TEXT';
export const ADD_NEW_FEATURE = 'ANNOTATIONS:ADD_NEW_FEATURE';
export const SET_EDITING_FEATURE = 'ANNOTATIONS:SET_EDITING_FEATURE';
export const HIGHLIGHT_POINT = 'ANNOTATIONS:HIGHLIGHT_POINT';
export const TOGGLE_DELETE_FT_MODAL = 'ANNOTATIONS:TOGGLE_DELETE_FT_MODAL';
export const CONFIRM_DELETE_FEATURE = 'ANNOTATIONS:CONFIRM_DELETE_FEATURE';
export const CHANGE_FORMAT = 'ANNOTATIONS:CHANGE_FORMAT';
export const UPDATE_SYMBOLS = 'ANNOTATIONS:UPDATE_SYMBOLS';
export const ERROR_SYMBOLS = 'ANNOTATIONS:ERROR_SYMBOLS';

export const updateSymbols = (symbols = []) => ({
    type: UPDATE_SYMBOLS,
    symbols
});
export const setErrorSymbol = (symbolErrors) => ({
    type: ERROR_SYMBOLS,
    symbolErrors
});

export function loadAnnotations(features, override = false) {
    return {
        type: LOAD_ANNOTATIONS,
        features,
        override
    };
}
export function confirmDeleteFeature() {
    return {
        type: CONFIRM_DELETE_FEATURE
    };
}
export function openEditor(id) {
    return {
        type: OPEN_EDITOR,
        id
    };
}
export function changeFormat(format) {
    return {
        type: CHANGE_FORMAT,
        format
    };
}
export function toggleDeleteFtModal() {
    return {
        type: TOGGLE_DELETE_FT_MODAL
    };
}
export function highlightPoint(point) {
    return {
        type: HIGHLIGHT_POINT,
        point
    };
}

export function download(annotation) {
    return {
        type: DOWNLOAD,
        annotation
    };
}


export function editAnnotation(id) {
    return (dispatch, getState) => {
        const feature = head(head(getState().layers.flat.filter(l => l.id === 'annotations')).features.filter(f => f.properties.id === id));
        if (feature.type === "FeatureCollection") {
            dispatch({
                type: EDIT_ANNOTATION,
                feature,
                featureType: feature.type
            });
        } else {
            dispatch({
                type: EDIT_ANNOTATION,
                feature,
                featureType: feature.geometry.type
            });
        }
    };
}
export function newAnnotation() {
    return {
        type: NEW_ANNOTATION
    };
}
export function changeSelected(coordinates, radius, text, crs) {
    return {
        type: CHANGED_SELECTED,
        coordinates,
        radius,
        text,
        crs
    };
}
export function setInvalidSelected(errorFrom, coordinates) {
    return {
        type: SET_INVALID_SELECTED,
        errorFrom,
        coordinates
    };
}
export function addText() {
    return {
        type: ADD_TEXT
    };
}
export function changedProperties(field, value) {
    return {
        type: CHANGED_PROPERTIES,
        field,
        value
    };
}
export function removeAnnotation(id) {
    return {
        type: REMOVE_ANNOTATION,
        id
    };
}
export function removeAnnotationGeometry() {
    return {
        type: REMOVE_ANNOTATION_GEOMETRY
    };
}
export function confirmRemoveAnnotation(id) {
    return {
        type: CONFIRM_REMOVE_ANNOTATION,
        id
    };
}
export function cancelRemoveAnnotation() {
    return {
        type: CANCEL_REMOVE_ANNOTATION
    };
}
export function cancelEditAnnotation() {
    return {
        type: CANCEL_EDIT_ANNOTATION
    };
}
export function saveAnnotation(id, fields, geometry, style, newFeature, properties) {
    return {
        type: SAVE_ANNOTATION,
        id,
        fields,
        geometry,
        style,
        newFeature,
        properties
    };
}
export function toggleAdd(featureType) {
    return {
        type: TOGGLE_ADD,
        featureType
    };
}
export function toggleStyle() {
    return {
        type: TOGGLE_STYLE
    };
}
export function restoreStyle() {
    return {
        type: RESTORE_STYLE
    };
}
export function setStyle(style) {
    return {
        type: SET_STYLE,
        style
    };
}
export function updateAnnotationGeometry(geometry, textChanged, circleChanged) {
    return {
        type: UPDATE_ANNOTATION_GEOMETRY,
        geometry,
        textChanged,
        circleChanged
    };
}
export function validationError(errors) {
    return {
        type: VALIDATION_ERROR,
        errors
    };
}
export function highlight(id) {
    return {
        type: HIGHLIGHT,
        id
    };
}
export function cleanHighlight() {
    return {
        type: CLEAN_HIGHLIGHT
    };
}
export function showAnnotation(id) {
    return {
        type: SHOW_ANNOTATION,
        id
    };
}
export function cancelShowAnnotation() {
    return {
        type: CANCEL_SHOW_ANNOTATION
    };
}
export function filterAnnotations(filter) {
    return {
        type: FILTER_ANNOTATIONS,
        filter
    };
}
export function closeAnnotations() {
    return {
        type: CLOSE_ANNOTATIONS
    };
}
export function confirmCloseAnnotations() {
    return {
        type: CONFIRM_CLOSE_ANNOTATIONS
    };
}
export function setUnsavedChanges(unsavedChanges) {
    return {
        type: UNSAVED_CHANGES,
        unsavedChanges
    };
}
export function setUnsavedStyle(unsavedStyle) {
    return {
        type: UNSAVED_STYLE,
        unsavedStyle
    };
}
export function addNewFeature() {
    return {
        type: ADD_NEW_FEATURE
    };
}
export function setEditingFeature(feature) {
    return {
        type: SET_EDITING_FEATURE,
        feature
    };
}
export function cancelCloseAnnotations() {
    return {
        type: CANCEL_CLOSE_ANNOTATIONS
    };
}
export function startDrawing() {
    return {
        type: START_DRAWING
    };
}
export function toggleUnsavedChangesModal() {
    return {
        type: TOGGLE_CHANGES_MODAL
    };
}
export function toggleUnsavedGeometryModal() {
    return {
        type: TOGGLE_GEOMETRY_MODAL
    };
}
export function toggleUnsavedStyleModal() {
    return {
        type: TOGGLE_STYLE_MODAL
    };
}
export function resetCoordEditor() {
    return {
        type: RESET_COORD_EDITOR
    };
}
export function changeRadius(radius, components, crs) {
    return {
        type: CHANGE_RADIUS,
        radius,
        components,
        crs
    };
}

export function changeText(text, components) {
    return {
        type: CHANGE_TEXT,
        text,
        components
    };
}
