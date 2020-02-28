/*
* Copyright 2017, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import assign from 'object-assign';
import React from 'react';
import { connect } from 'react-redux';

import {
    changeDrawingStatus,
    drawStopped,
    drawingFeatures,
    endDrawing,
    geometryChanged,
    selectFeatures,
    setCurrentStyle
} from '../../actions/draw';
import { updateHighlighted } from '../../actions/highlight';
import { layerError, layerLoad, layerLoading } from '../../actions/layers';
import { changeLocateState, onLocateError } from '../../actions/locate';
import { changeMapView, clickOnMap } from '../../actions/map';
import { changeGeometry, changeMeasurementState, resetGeometry, updateMeasures } from '../../actions/measurement';
import { changeMousePosition } from '../../actions/mousePosition';
import { warning } from '../../actions/notifications';
import { changeSelectionState } from '../../actions/selection';
import { projectionDefsSelector } from '../../selectors/map';
import { measurementSelector } from '../../selectors/measurement';

const Empty = () => { return <span/>; };

export default async(mapType, actions) => {

    const Module = await import(`./${mapType}/index`);
    const components = Module.default;

    const LMap = connect((state) => ({
        projectionDefs: projectionDefsSelector(state),
        mousePosition: state.mousePosition || {enabled: false}
    }), assign({}, {
        onCreationError: () => {},
        onMapViewChanges: changeMapView,
        onClick: clickOnMap,
        onMouseMove: changeMousePosition,
        onLayerLoading: layerLoading,
        onLayerLoad: layerLoad,
        onLayerError: layerError,
        onWarning: warning
    }, actions), (stateProps, dispatchProps, ownProps) => {
        return assign({}, ownProps, stateProps, assign({}, dispatchProps, {
            onMouseMove: stateProps.mousePosition.enabled ? dispatchProps.onMouseMove : () => {}
        }));
    })(components.LMap);

    const MeasurementSupport = connect((state) => ({
        enabled: state.controls && state.controls.measure && state.controls.measure.enabled || false,
        // TODO TEST selector to validate the feature: filter the coords, if length >= minValue return ft validated (close the polygon) else empty ft
        measurement: measurementSelector(state),
        useTreshold: state.measurement && state.measurement.useTreshold || null,
        uom: state.measurement && state.measurement.uom || {
            length: {unit: 'm', label: 'm'},
            area: {unit: 'sqm', label: 'm²'}
        }
    }), {
        changeMeasurementState,
        updateMeasures,
        resetGeometry,
        changeGeometry
    })(components.MeasurementSupport || Empty);

    const Locate = connect((state) => ({
        status: state.locate && state.locate.state,
        messages: state.locale && state.locale.messages ? state.locale.messages.locate : undefined
    }), {
        changeLocateState,
        onLocateError
    })(components.Locate || Empty);

    const DrawSupport = connect((state) =>
        state.draw || {}, {
        onChangeDrawingStatus: changeDrawingStatus,
        onEndDrawing: endDrawing,
        onGeometryChanged: geometryChanged,
        onSelectFeatures: selectFeatures,
        onDrawingFeatures: drawingFeatures,
        onDrawStopped: drawStopped,
        setCurrentStyle: setCurrentStyle
    })( components.DrawSupport || Empty);

    const HighlightSupport = connect((state) =>
        state.highlight || {}, {updateHighlighted})( components.HighlightFeatureSupport || Empty);

    const SelectionSupport = connect((state) => ({
        selection: state.selection || {}
    }), {
        changeSelectionState
    })(components.SelectionSupport || Empty);

    // import(`../../components/map/${mapType}/plugins/index`);
    require('../../components/map/' + mapType + '/plugins/index');
    const LLayer = connect(null, {onWarning: warning})( components.Layer || Empty);

    return {
        Map: LMap,
        Layer: LLayer,
        Feature: components.Feature || Empty,
        tools: {
            measurement: MeasurementSupport,
            locate: Locate,
            overview: components.Overview || Empty,
            scalebar: components.ScaleBar || Empty,
            draw: DrawSupport,
            highlight: HighlightSupport,
            selection: SelectionSupport
        }
    };
};
