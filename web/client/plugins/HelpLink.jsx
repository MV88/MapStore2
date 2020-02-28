/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import assign from 'object-assign';
import { Glyphicon } from 'react-bootstrap';
import Message from '../components/I18N/Message';
import help from '../reducers/help';

export default {
    HelpLinkPlugin: assign(class extends React.Component {
        render() {
            return null;
        }
    }, {
        BurgerMenu: {
            name: 'helplink',
            position: 1100,
            text: <Message msgId="docs"/>,
            icon: <Glyphicon glyph="question-sign"/>,
            action: () => ({type: ''}),
            selector: () => ({href: 'https://mapstore.readthedocs.io/en/latest/', target: 'blank'}),
            priority: 2,
            doNotHide: true
        }
    }),
    reducers: {help}
};
