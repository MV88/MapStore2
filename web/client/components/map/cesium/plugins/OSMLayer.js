/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Layers from '../../../../utils/cesium/Layers';

import Cesium from '../../../../libs/cesium';

Layers.registerType('osm', () => {
    return Cesium.createOpenStreetMapImageryProvider({
        url: '//a.tile.openstreetmap.org/'
    });
});
