/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import Rx from 'rxjs';
import {ADD_MEASURE_AS_ANNOTATION} from '../actions/measurement';
import {getStartEndPointsForLinestring, DEFAULT_ANNOTATIONS_STYLES, STYLE_TEXT} from '../utils/AnnotationsUtils';
import {convertUom, getFormattedBearingValue, validateFeatureCoordinates} from '../utils/MeasureUtils';
import {toggleControl, SET_CONTROL_PROPERTY} from '../actions/controls';
import {closeFeatureGrid} from '../actions/featuregrid';
import {purgeMapInfoResults, hideMapinfoMarker} from '../actions/mapInfo';
import {transformLineToArcs} from '../utils/CoordinatesUtils';
import uuidv1 from 'uuid/v1';
import assign from 'object-assign';
import {last, round} from 'lodash';
import {showCoordinateEditorSelector} from '../selectors/controls';
import {newAnnotation, setEditingFeature} from '../actions/annotations';

const formattedValue = (uom, value) => ({
    "length": round(convertUom(value, "m", uom) || 0, 2) + " " + uom,
    "area": round(convertUom(value, "sqm", uom) || 0, 2) + " " + uom,
    "bearing": getFormattedBearingValue(round(value || 0, 6)).toString()
});
const isLineString = (state) => {
    return state.measurement.geomType === "LineString";
};

const convertMeasureToGeoJSON = (measureGeometry, value, uom, id, measureTool, state) => {
    return assign({}, {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: measureGeometry.type === "LineString" ? last(measureGeometry.coordinates) : last(measureGeometry.coordinates[0])
                },
                properties: {
                    valueText: formattedValue(uom, value)[measureTool],
                    isText: true,
                    isValidFeature: true,
                    id: uuidv1()
                },
                style: [{
                    ...STYLE_TEXT,
                    id: uuidv1(),
                    filtering: true,
                    title: "Text Style",
                    type: "Text"
                }]
            },
            {
                type: "Feature",
                geometry: {
                    coordinates: validateFeatureCoordinates(measureGeometry),
                    type: isLineString(state) ? "MultiPoint" : measureGeometry.type},
                properties: {
                    isValidFeature: true,
                    useGeodesicLines: isLineString(state), // this is reduntant? remove it, check in the codebase where is used and use the geom dta instad
                    id: uuidv1(),
                    geometryGeodesic: isLineString(state) ? {type: "LineString", coordinates: transformLineToArcs(measureGeometry.coordinates)} : null
                },
                style: [{
                    ...DEFAULT_ANNOTATIONS_STYLES[measureGeometry.type],
                    type: measureGeometry.type,
                    id: uuidv1(),
                    geometry: isLineString(state) ? "lineToArc" : null,
                    title: `${measureGeometry.type} Style`,
                    filtering: true
                }].concat(measureGeometry.type === "LineString" ? getStartEndPointsForLinestring() : [])
            }
        ],
        properties: {
            id,
            description: " " + formattedValue(uom, value)[measureTool]
        },
        style: {}
    });
};

export default {
    addAnnotationFromMeasureEpic: (action$, store) =>
        action$.ofType(ADD_MEASURE_AS_ANNOTATION)
            .switchMap((a) => {
                const state = store.getState();
                // transform measure feature into geometry collection
                // add feature property to manage text annotation with value and uom
                const {feature, value, uom, measureTool} = a;
                const id = uuidv1();
                const newFeature = convertMeasureToGeoJSON(feature.geometry, value, uom, id, measureTool, state);

                return Rx.Observable.of(
                    toggleControl('annotations', null),
                    newAnnotation(),
                    setEditingFeature(newFeature)
                );
            }),
    openMeasureEpic: (action$, store) =>
        action$.ofType(SET_CONTROL_PROPERTY)
            .filter((action) => action.control === "measure" && action.value && showCoordinateEditorSelector(store.getState()))
            .switchMap(() => {
                return Rx.Observable.of(closeFeatureGrid(), purgeMapInfoResults(), hideMapinfoMarker());
            })
};
