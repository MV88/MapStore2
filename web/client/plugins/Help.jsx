/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { connect } from 'react-redux';
import assign from 'object-assign';
import { Glyphicon } from 'react-bootstrap';
import Message from '../components/I18N/Message';
import { toggleControl } from '../actions/controls';

const HelpTextPanel = connect((state) => ({
    isVisible: state.controls && state.controls.help && state.controls.help.enabled,
    helpText: state.help && state.help.helpText
}), {
    onClose: toggleControl.bind(null, 'help', null)
})(require('../components/help/HelpTextPanel'));

export default {
    HelpPlugin: assign(HelpTextPanel, {
        Toolbar: {
            name: 'help',
            position: 1000,
            icon: <Glyphicon glyph="question-sign"/>,
            tooltip: "help",
            toggle: true,
            priority: 1
        },
        BurgerMenu: {
            name: 'help',
            position: 1000,
            text: <Message msgId="help"/>,
            icon: <Glyphicon glyph="question-sign"/>,
            action: toggleControl.bind(null, 'help', null),
            priority: 2,
            doNotHide: true
        }
    }),
    reducers: {help: require('../reducers/help')}
};
