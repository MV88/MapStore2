/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');
const {createSelector} = require('reselect');
const {mapSelector} = require('../selectors/map');

// TODO: make step and glyphicon configurable
const selector = createSelector([mapSelector], (map) => ({currentZoom: map && map.zoom, id: "zoomin-btn", step: 1, glyphicon: "plus"}));

const {changeZoomLevel} = require('../actions/map');

const Message = require('../components/I18N/Message');

/**
  * ZoomIn Plugin. Provides button to zoom in
  * @class  ZoomIn
  * @memberof plugins
  * @static
  *
  * @prop {object} cfg.style CSS to apply to the button
  * @prop {string} cfg.className the class name for the button
  *
  */
const ZoomInButton = connect(selector, {
    onZoom: changeZoomLevel
})(require('../components/buttons/ZoomButton'));

require('./zoom/zoom.css');

const assign = require('object-assign');


export default {
    ZoomInPlugin: assign(ZoomInButton, {
        disablePluginIf: "{state('mapType') === 'cesium'}",
        Toolbar: {
            name: "ZoomIn",
            position: 3,
            tooltip: "zoombuttons.zoomInTooltip",
            help: <Message msgId="helptexts.zoomIn"/>,
            tool: true,
            priority: 1
        }
    }),
    reducers: {}
};
