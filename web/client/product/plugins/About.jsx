/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { connect } from 'react-redux';
import Message from '../../components/I18N/Message';
import { toggleControl } from '../../actions/controls';

const About = connect((state) => ({
    enabled: state.controls && state.controls.about && state.controls.about.enabled || false,
    withButton: false
}), {
    onClose: toggleControl.bind(null, 'about', null)
})(require('../components/viewer/about/About'));

import assign from 'object-assign';
import { Glyphicon } from 'react-bootstrap';

export default {
    AboutPlugin: assign(About,
        {
            BurgerMenu: {
                name: 'about',
                position: 1500,
                text: <Message msgId="about_title"/>,
                icon: <Glyphicon glyph="info-sign"/>,
                action: toggleControl.bind(null, 'about', null),
                priority: 1,
                doNotHide: true
            }
        }),
    reducers: {}
};
