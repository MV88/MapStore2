/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { connect } from 'react-redux';
import { changeLocateState } from '../actions/locate';
import Message from './locale/Message';
import { Glyphicon } from 'react-bootstrap';
import assign from 'object-assign';
import LocateBtn from '../components/mapcontrols/locate/LocateBtn';
import locate from '../reducers/locate';
/**
  * Locate Plugin. Provides button to locate the user's position on the map.
  * By deafault it will follow the user until he moves the map. He can click again to
  * restore the following mode.
  * @class  Locate
  * @memberof plugins
  * @static
  *
  * @prop {string} cfg.style CSS to apply to the button
  * @prop {string} cfg.text The button text, if any
  * @prop {string} cfg.className the class name for the button
  *
  */
const LocatePlugin = connect((state) => ({
    locate: state.locate && state.locate.state || 'DISABLED'
}), {
    onClick: changeLocateState
})(LocateBtn);

import './locate/locate.css';

export default {
    LocatePlugin: assign(LocatePlugin, {
        disablePluginIf: "{state('mapType') === 'cesium'}",
        Toolbar: {
            name: 'locate',
            position: 2,
            tool: true,
            tooltip: "locate.tooltip",
            icon: <Glyphicon glyph="screenshot"/>,
            help: <Message msgId="helptexts.locateBtn"/>,
            priority: 1
        }
    }),
    reducers: {locate}
};
