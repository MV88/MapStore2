/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { Glyphicon } from 'react-bootstrap';
import assign from 'object-assign';
import Message from '../components/I18N/Message';
import ExpanderPlugin from '../components/buttons/ToggleButton';

export default {
    ExpanderPlugin: assign(ExpanderPlugin, {
        Toolbar: {
            name: 'expand',
            position: 10000,
            alwaysVisible: true,
            tooltip: "expandtoolbar.tooltip",
            icon: <Glyphicon glyph="option-horizontal"/>,
            help: <Message msgId="helptexts.expandToolbar"/>,
            toggle: true,
            toggleControl: 'toolbar',
            toggleProperty: 'expanded',
            priority: 1
        }
    }),
    reducers: {}
};
