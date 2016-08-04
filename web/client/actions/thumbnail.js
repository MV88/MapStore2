/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
// const GeoStoreApi = require('../api/GeoStoreDAO');

const REMOVE_THUMBNAIL = 'REMOVE_THUMBNAIL';

function removeThumbnail() {
    return {
        type: REMOVE_THUMBNAIL
    };
}


module.exports = {
    REMOVE_THUMBNAIL,
    removeThumbnail
};
