/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import {connect} from 'react-redux';
import { createPlugin } from '../utils/PluginsUtils';
import {changeLocateState, onLocateError} from '../actions/locate';

import Message from './locale/Message';

import {Glyphicon} from 'react-bootstrap';
import locate from '../reducers/locate';
import LocateBtn  from '../components/mapcontrols/locate/LocateBtn';
import LocateTool from "../components/mapcontrols/locate/LocateTool";
/**
  * Locate Plugin. Provides button to locate the user's position on the map.
  * By default it will follow the user until he interacts with the map.
  * When the user move the map the follow mode deactivates and the locate tool is
  * still active, only showing the user's position on the map. Clicking again on the locate tool
  * will activate the following mode again.
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
    locate: state.locate && state.locate.state || 'DISABLED',
    tooltip: state.locate && state.locate.state === 'FOLLOWING' ? "locate.tooltipDeactivate" : "locate.tooltip"
}), {
    onClick: changeLocateState
})(LocateBtn);

require('./locate/locate.css');


export default createPlugin('Locate', {
    component: LocatePlugin,
    disablePluginIf: "{state('mapType') === 'cesium'}",
    containers: {
        Toolbar: {
            name: 'locate',
            position: 2,
            tool: true,
            icon: <Glyphicon glyph="screenshot"/>,
            help: <Message msgId="helptexts.locateBtn"/>,
            priority: 1
        },
        Map: {
            name: "Locate",
            Tool: connect((state) => ({
                status: state.locate && state.locate.state,
                messages: state.locale && state.locale.messages ? state.locale.messages.locate : undefined
            }), {
                changeLocateState,
                onLocateError
            })(LocateTool),
            priority: 1
        }
    },
    reducers: {locate}
});
