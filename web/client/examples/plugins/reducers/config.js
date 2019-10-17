/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {SAVE_PLUGIN_CONFIG, COMPILE_ERROR} from '../actions/config';

import assign from 'object-assign';

function my(state = {}, action) {
    switch (action.type) {
    case SAVE_PLUGIN_CONFIG: {
        return assign({}, state, {[action.plugin]: action.cfg});
    }
    case COMPILE_ERROR: {
        return assign({}, state, {error: action.message});
    }
    default:
        return state;
    }
}

export default my;
