/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { THEME_SELECTED } from '../actions/theme';

import assign from 'object-assign';

function controls(state = {}, action) {
    switch (action.type) {
    case THEME_SELECTED:
        return assign({}, state, {
            selectedTheme: action.theme
        });
    default:
        return state;
    }
}

module.exports = controls;
