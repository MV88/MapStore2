/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


import React from 'react';

import { connect } from 'react-redux';
import Message from './locale/Message';
import { Glyphicon } from 'react-bootstrap';
import assign from 'object-assign';
import { changeLayerProperties } from '../actions/layers';

const BackgroundSwitcherPlugin = connect((state) => ({
    layers: state.layers && state.layers.flat && state.layers.flat.filter((layer) => layer.group === "background") || []
}), {
    propertiesChangeHandler: changeLayerProperties
})(require('../components/TOC/background/BackgroundSwitcher'));

import './background/background.css';
/**
  * BackgroundSwitcher Plugin
  * @class BackgroundSwitcher
  * @memberof plugins
  * @static
  *
  * @prop {string} cfg.id identifier of the Plugin
  * @prop {boolean} cfg.fluid container should be fluid, see {@link http://getbootstrap.com/css/#grid}
  *
  */
export default {
    BackgroundSwitcherPlugin: assign(BackgroundSwitcherPlugin, {
        Toolbar: {
            name: 'backgroundswitcher',
            position: 8,
            exclusive: true,
            panel: true,
            help: <Message msgId="helptexts.backgroundSwitcher"/>,
            tooltip: "backgroundSwither.tooltip",
            icon: <Glyphicon glyph="globe"/>,
            wrap: true,
            title: 'background',
            priority: 1
        },
        DrawerMenu: {
            name: 'backgroundswitcher',
            position: 2,
            icon: <Glyphicon glyph="1-map"/>,
            title: 'background',
            buttonConfig: {
                buttonClassName: "square-button no-border",
                tooltip: "toc.backgroundSwitcher"
            },
            priority: 2
        }
    }),
    reducers: {}
};
