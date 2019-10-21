/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import assign from 'object-assign';
import { goToPage } from '../actions/router';
import Message from './locale/Message';
import { Glyphicon } from 'react-bootstrap';
import Home from '../components/home/Home';

export default {
    HomePlugin: assign(Home, {
        Toolbar: {
            name: 'home',
            position: 1,
            tooltip: "gohome",
            icon: <Glyphicon glyph="home"/>,
            help: <Message msgId="helptexts.gohome"/>,
            action: (context) => goToPage('/', context.router),
            priority: 1
        },
        BurgerMenu: {
            name: 'home',
            position: 1,
            text: <Message msgId="gohome"/>,
            icon: <Glyphicon glyph="home"/>,
            action: (context) => goToPage('/', context.router),
            priority: 2
        },
        OmniBar: {
            name: 'home',
            position: 4,
            tool: true,
            action: (context) => goToPage('/', context.router),
            priority: 3
        }
    }),
    reducers: {}
};
