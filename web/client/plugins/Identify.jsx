/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import assign from 'object-assign';
import { mapSelector } from '../selectors/map';
import { layersSelector } from '../selectors/layers';
import { mapTypeSelector } from '../selectors/maptype';

import {
    generalInfoFormatSelector,
    clickPointSelector,
    indexSelector,
    responsesSelector,
    validResponsesSelector,
    showEmptyMessageGFISelector,
    isHighlightEnabledSelector,
    currentFeatureSelector,
    currentFeatureCrsSelector
} from '../selectors/mapInfo';

import {
    hideMapinfoMarker,
    showMapinfoRevGeocode,
    hideMapinfoRevGeocode,
    clearWarning,
    toggleMapInfoState,
    changeMapInfoFormat,
    updateCenterToMarker,
    closeIdentify,
    purgeMapInfoResults,
    featureInfoClick,
    changeFormat,
    toggleShowCoordinateEditor,
    changePage,
    toggleHighlightFeature
} from '../actions/mapInfo';

import DefaultViewerComp from '../components/data/identify/DefaultViewer';
import IdentifyContainerComp from '../components/data/identify/IdentifyContainer';
import FeatureInfoFormatSelectorComp from '../components/misc/FeatureInfoFormatSelector';
import mapInfo from '../reducers/mapInfo';
import epics from '../epics/identify';

import { changeMousePointer, zoomToExtent } from '../actions/map';
import { currentLocaleSelector } from '../selectors/locale';
import { mapLayoutValuesSelector } from '../selectors/maplayout';
import { compose, defaultProps } from 'recompose';
import MapInfoUtils from '../utils/MapInfoUtils';
import loadingState from '../components/misc/enhancers/loadingState';
import { defaultViewerHandlers, defaultViewerDefaultProps } from '../components/data/identify/enhancers/defaultViewer';
import { identifyLifecycle } from '../components/data/identify/enhancers/identify';
import zoomToFeatureHandler from '..//components/data/identify/enhancers/zoomToFeatureHandler';
import getToolButtons from './identify/toolButtons';
import getNavigationButtons from './identify/navigationButtons';
import Message from './locale/Message';
import './identify/identify.css';

const selector = createStructuredSelector({
    enabled: (state) => state.mapInfo && state.mapInfo.enabled || state.controls && state.controls.info && state.controls.info.enabled || false,
    responses: responsesSelector,
    validResponses: validResponsesSelector,
    requests: (state) => state.mapInfo && state.mapInfo.requests || [],
    format: generalInfoFormatSelector,
    map: mapSelector,
    layers: layersSelector,
    point: clickPointSelector,
    showModalReverse: (state) => state.mapInfo && state.mapInfo.showModalReverse,
    reverseGeocodeData: (state) => state.mapInfo && state.mapInfo.reverseGeocodeData,
    warning: (state) => state.mapInfo && state.mapInfo.warning,
    currentLocale: currentLocaleSelector,
    dockStyle: state => mapLayoutValuesSelector(state, {height: true}),
    formatCoord: (state) => state.mapInfo && state.mapInfo.formatCoord,
    showCoordinateEditor: (state) => state.mapInfo && state.mapInfo.showCoordinateEditor,
    showEmptyMessageGFI: state => showEmptyMessageGFISelector(state)
});
// result panel

/*
 * Enhancer to enable set index only if Component has not header in viewerOptions props
 */
const identifyIndex = compose(
    connect(
        createSelector(indexSelector, (index) => ({ index })),
        {
            setIndex: changePage
        }
    ),
    defaultProps({
        index: 0
    })
)
;
const DefaultViewer = compose(
    identifyIndex,
    defaultViewerDefaultProps,
    defaultViewerHandlers,
    loadingState(({responses}) => responses.length === 0)
)(DefaultViewerComp);


const identifyDefaultProps = defaultProps({
    formatCoord: "decimal",
    enabled: false,
    draggable: true,
    collapsible: false,
    format: MapInfoUtils.getDefaultInfoFormatValue(),
    requests: [],
    responses: [],
    viewerOptions: {},
    viewer: DefaultViewer,
    purgeResults: () => {},
    hideMarker: () => {},
    clearWarning: () => {},
    changeMousePointer: () => {},
    showRevGeocode: () => {},
    hideRevGeocode: () => {},
    containerProps: {
        continuous: false
    },
    enabledCoordEditorButton: true,
    showCoordinateEditor: false,
    showModalReverse: false,
    reverseGeocodeData: {},
    enableRevGeocode: true,
    wrapRevGeocode: false,
    style: {},
    point: {},
    layer: null,
    map: {},
    layers: [],
    panelClassName: "modal-dialog info-panel modal-content",
    headerClassName: "modal-header",
    bodyClassName: "modal-body info-wrap",
    dock: true,
    headerGlyph: "",
    closeGlyph: "1-close",
    className: "square-button",
    currentLocale: 'en-US',
    fullscreen: false,
    showTabs: true,
    showCoords: true,
    showLayerTitle: true,
    position: 'right',
    size: 660,
    getToolButtons,
    getNavigationButtons,
    showFullscreen: false,
    validResponses: [],
    validator: MapInfoUtils.getValidator, // TODO: move all validation from the components to the selectors
    zIndex: 1050
});

/**
 * This plugin allows get informations about clicked point. It can be configured to have a mobile or a desktop flavor.
 *
 * You can configure some of the features of this plugin by setting up the initial mapInfo state, then you need to update the "initialState.defaultState", or by the plugin configuration
 * ```
 * "mapInfo": {
 *   "enabled": true, // enabled by default
 *   "disabledAlwaysOn": false, // if true, disable always on setup
 *   "configuration": {
 *     "showEmptyMessageGFI": false // allow or deny the visiibility of message when you have no results from identify request
 *     "infoFormat": "text/plain" // default infoformat value, other values are "text/html" for text only or "application/json" for properties
 *   }
 * }
 * ```
 *
 * @class Identify
 * @memberof plugins
 * @static
 *
 * @prop showIn {string[]} List of the plugins where to show the plugin
 * @prop cfg.dock {bool} true shows dock panel, false shows modal
 * @prop cfg.draggable {boolean} draggable info window, when modal
 * @prop cfg.showHighlightFeatureButton {boolean} show the highlight feature button if the interrogation returned valid features (openlayers only)
 * @prop cfg.viewerOptions.container {expression} the container of the viewer, expression from the context
 * @prop cfg.viewerOptions.header {expression} the header of the viewer, expression from the context{expression}
 * @prop cfg.disableCenterToMarker {bool} disable zoom to marker action
 * @prop cfg.zIndex {number} component z index order
 *
 * @example
 * {
 *   "name": "Identify",
 *   "showIn": ["Settings"],
 *   "cfg": {
 *       "draggable": false,
 *       "dock": true,
 *       "viewerOptions": {
 *          "container": "{context.ReactSwipe}",
 *          "header": "{context.SwipeHeader}"
 *       }
 *    }
 * }
 *
 */

const IdentifyPlugin = compose(
    connect(selector, {
        purgeResults: purgeMapInfoResults,
        closeIdentify,
        onChangeClickPoint: featureInfoClick,
        onToggleShowCoordinateEditor: toggleShowCoordinateEditor,
        onChangeFormat: changeFormat,
        changeMousePointer,
        clearWarning,
        hideMarker: hideMapinfoMarker,
        showRevGeocode: showMapinfoRevGeocode,
        hideRevGeocode: hideMapinfoRevGeocode,
        onEnableCenterToMarker: updateCenterToMarker.bind(null, 'enabled')
    }),
    // highlight support
    compose(
        connect(
            createStructuredSelector({
                highlight: isHighlightEnabledSelector,
                currentFeature: currentFeatureSelector,
                currentFeatureCrs: currentFeatureCrsSelector
            }), {
                toggleHighlightFeature,
                zoomToExtent
            }
        ),
        zoomToFeatureHandler
    ),
    // disable with not supported mapTypes. TODO: remove when reproject (leaflet) and features draw available (cesium)
    connect(createSelector(mapTypeSelector, mapType => ({mapType})), {}, ({mapType}, _, { showHighlightFeatureButton, ...props }) => ({...props, showHighlightFeatureButton: mapType === 'openlayers' && showHighlightFeatureButton}) ),
    identifyDefaultProps,
    identifyIndex,
    defaultViewerHandlers,
    identifyLifecycle
)(IdentifyContainerComp);

// configuration UI
const FeatureInfoFormatSelector = connect((state) => ({
    infoFormat: generalInfoFormatSelector(state)
}), {
    onInfoFormatChange: changeMapInfoFormat
})(FeatureInfoFormatSelectorComp);

export default {
    IdentifyPlugin: assign(IdentifyPlugin, {
        Toolbar: {
            name: 'info',
            position: 6,
            tooltip: "info.tooltip",
            icon: <Glyphicon glyph="map-marker"/>,
            help: <Message msgId="helptexts.infoButton"/>,
            action: toggleMapInfoState,
            selector: (state) => ({
                bsStyle: state.mapInfo && state.mapInfo.enabled ? "success" : "primary",
                active: !!(state.mapInfo && state.mapInfo.enabled)
            })
        },
        Settings: {
            tool: <FeatureInfoFormatSelector
                key="featureinfoformat"
                label={<Message msgId="infoFormatLbl" />
                }/>,
            position: 3
        }
    }),
    reducers: {mapInfo},
    epics
};
