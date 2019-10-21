/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { mapSelector } from '../selectors/map';
import { Glyphicon } from 'react-bootstrap';

const selector = createSelector([mapSelector, state => state.mapInitialConfig], (map, mapInitialConfig) => ({mapConfig: map, mapInitialConfig: mapInitialConfig}));

import { changeMapView } from '../actions/map';

const ZoomToMaxExtentButton = connect(selector, {
    changeMapView
})(require('../components/buttons/ZoomToMaxExtentButton'));

import Message from '../components/I18N/Message';
import './zoomall/zoomall.css';

class ZoomAllPlugin extends React.Component {
    render() {
        return (
            <ZoomToMaxExtentButton
                key="zoomToMaxExtent" {...this.props} useInitialExtent/>);
    }
}

import assign from 'object-assign';

export default {
    ZoomAllPlugin: assign(ZoomAllPlugin, {
        Toolbar: {
            name: "ZoomAll",
            position: 7,
            tooltip: "zoombuttons.zoomAllTooltip",
            icon: <Glyphicon glyph="resize-full"/>,
            help: <Message msgId="helptexts.zoomToMaxExtentButton"/>,
            tool: true,
            priority: 1
        }
    }),
    reducers: {}
};
