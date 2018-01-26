/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const EDIT_ANNOTATION = 'ANNOTATIONS:EDIT';
const SHOW_ANNOTATION = 'ANNOTATIONS:SHOW';
const NEW_ANNOTATION = 'ANNOTATIONS:NEW';
const REMOVE_ANNOTATION = 'ANNOTATIONS:REMOVE';
const REMOVE_ANNOTATION_GEOMETRY = 'ANNOTATIONS:REMOVE_GEOMETRY';
const CONFIRM_REMOVE_ANNOTATION = 'ANNOTATIONS:CONFIRM_REMOVE';
const CANCEL_REMOVE_ANNOTATION = 'ANNOTATIONS:CANCEL_REMOVE';
const CANCEL_EDIT_ANNOTATION = 'ANNOTATIONS:CANCEL_EDIT';
const CANCEL_SHOW_ANNOTATION = 'ANNOTATIONS:CANCEL_SHOW';
const SAVE_ANNOTATION = 'ANNOTATIONS:SAVE';
const TOGGLE_ADD = 'ANNOTATIONS:TOGGLE_ADD';
const TOGGLE_STYLE = 'ANNOTATIONS:TOGGLE_STYLE';
const SET_STYLE = 'ANNOTATIONS:SET_STYLE';
const RESTORE_STYLE = 'ANNOTATIONS:RESTORE_STYLE';
const UPDATE_ANNOTATION_GEOMETRY = 'ANNOTATIONS:UPDATE_GEOMETRY';
const VALIDATION_ERROR = 'ANNOTATIONS:VALIDATION_ERROR';
const HIGHLIGHT = 'ANNOTATIONS:HIGHLIGHT';
const CLEAN_HIGHLIGHT = 'ANNOTATIONS:CLEAN_HIGHLIGHT';
const FILTER_ANNOTATIONS = 'ANNOTATIONS:FILTER';
const CLOSE_ANNOTATIONS = 'ANNOTATIONS:CLOSE';
const CONFIRM_CLOSE_ANNOTATIONS = 'ANNOTATIONS:CONFIRM_CLOSE';
const CANCEL_CLOSE_ANNOTATIONS = 'ANNOTATIONS:CANCEL_CLOSE';
const STOP_DRAWING = 'ANNOTATIONS:STOP_DRAWING';

const {head} = require('lodash');
const DEFAULT_ANNOTATIONS_STYLES = {
    "Point": {
        iconGlyph: 'comment',
        iconShape: 'square',
        iconColor: 'blue'
    },
    "LineString": {
        color: '#ffcc33',
        opacity: 1,
        weight: 3,
        fillColor: '#ffffff',
        fillOpacity: 0.2,
        clickable: false,
        editing: {
            fill: 1
        }
    },
    "Polygon": {
        color: '#ffcc33',
        opacity: 1,
        weight: 3,
        fillColor: '#ffffff',
        fillOpacity: 0.2,
        clickable: false,
        editing: {
            fill: 1
        }
    }
};
function editAnnotation(id) {
    return (dispatch, getState) => {
        const feature = head(head(getState().layers.flat.filter(l => l.id === 'annotations')).features.filter(f => f.properties.id === id));
        dispatch({
            type: EDIT_ANNOTATION,
            feature,
            featureType: feature.geometry.type
        });
    };
}

function newAnnotation(featureType) {
    return {
        type: NEW_ANNOTATION,
        featureType
    };
}

function removeAnnotation(id) {
    return {
        type: REMOVE_ANNOTATION,
        id
    };
}

function removeAnnotationGeometry() {
    return {
        type: REMOVE_ANNOTATION_GEOMETRY
    };
}

function confirmRemoveAnnotation(id) {
    return {
        type: CONFIRM_REMOVE_ANNOTATION,
        id
    };
}

function cancelRemoveAnnotation() {
    return {
        type: CANCEL_REMOVE_ANNOTATION
    };
}

function cancelEditAnnotation() {
    return {
        type: CANCEL_EDIT_ANNOTATION
    };
}

function saveAnnotation(id, fields, geometry, style, newFeature) {
    return {
        type: SAVE_ANNOTATION,
        id,
        fields,
        geometry,
        style,
        newFeature
    };
}

function toggleAdd(featureType) {
    return {
        type: TOGGLE_ADD,
        featureType
    };
}

function toggleStyle() {
    return {
        type: TOGGLE_STYLE
    };
}

function restoreStyle() {
    return {
        type: RESTORE_STYLE
    };
}

function setStyle(style) {
    return {
        type: SET_STYLE,
        style
    };
}

function updateAnnotationGeometry(geometry) {
    return {
        type: UPDATE_ANNOTATION_GEOMETRY,
        geometry
    };
}

function validationError(errors) {
    return {
        type: VALIDATION_ERROR,
        errors
    };
}

function highlight(id) {
    return {
        type: HIGHLIGHT,
        id
    };
}

function cleanHighlight() {
    return {
        type: CLEAN_HIGHLIGHT
    };
}

function showAnnotation(id) {
    return {
        type: SHOW_ANNOTATION,
        id
    };
}

function cancelShowAnnotation() {
    return {
        type: CANCEL_SHOW_ANNOTATION
    };
}

function filterAnnotations(filter) {
    return {
        type: FILTER_ANNOTATIONS,
        filter
    };
}

function closeAnnotations() {
    return {
        type: CLOSE_ANNOTATIONS
    };
}

function confirmCloseAnnotations() {
    return {
        type: CONFIRM_CLOSE_ANNOTATIONS
    };
}

function cancelCloseAnnotations() {
    return {
        type: CANCEL_CLOSE_ANNOTATIONS
    };
}

function stopDrawing() {
    return {
        type: STOP_DRAWING
    };
}

module.exports = {
    SHOW_ANNOTATION,
    EDIT_ANNOTATION,
    NEW_ANNOTATION,
    REMOVE_ANNOTATION,
    CONFIRM_REMOVE_ANNOTATION,
    CANCEL_REMOVE_ANNOTATION,
    CANCEL_EDIT_ANNOTATION,
    SAVE_ANNOTATION,
    TOGGLE_ADD,
    UPDATE_ANNOTATION_GEOMETRY,
    VALIDATION_ERROR,
    REMOVE_ANNOTATION_GEOMETRY,
    TOGGLE_STYLE,
    SET_STYLE,
    RESTORE_STYLE,
    HIGHLIGHT,
    CLEAN_HIGHLIGHT,
    CANCEL_SHOW_ANNOTATION,
    FILTER_ANNOTATIONS,
    CLOSE_ANNOTATIONS,
    CONFIRM_CLOSE_ANNOTATIONS,
    CANCEL_CLOSE_ANNOTATIONS,
    STOP_DRAWING,
    stopDrawing,
    editAnnotation,
    newAnnotation,
    removeAnnotation,
    confirmRemoveAnnotation,
    cancelRemoveAnnotation,
    cancelEditAnnotation,
    saveAnnotation,
    toggleAdd,
    updateAnnotationGeometry,
    validationError,
    removeAnnotationGeometry,
    toggleStyle,
    setStyle,
    restoreStyle,
    highlight,
    cleanHighlight,
    showAnnotation,
    cancelShowAnnotation,
    filterAnnotations,
    closeAnnotations,
    confirmCloseAnnotations,
    cancelCloseAnnotations,
    DEFAULT_ANNOTATIONS_STYLES
};
