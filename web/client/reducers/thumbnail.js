/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {
    REMOVE_THUMBNAIL
} = require('../actions/thumbnail');

const assign = require('object-assign');

const initialState = {
    loading: false,
    files: [],
    srcImg: "",
    enabled: false
};

function thumbnail(state = initialState, action) {
    switch (action.type) {
        case REMOVE_THUMBNAIL: {
            return assign({}, state, {srcImg: "", enabled: false});
        }
        default:
            return state;
    }
}

module.exports = thumbnail;
