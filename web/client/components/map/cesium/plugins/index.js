/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
    BingLayer: require('./BingLayer').default,
    OSMLayer: require('./OSMLayer').default,
    TileProviderLayer: require('./TileProviderLayer').default,
    WMSLayer: require('./WMSLayer').default,
    WMTSLayer: require('./WMTSLayer').default,
    GraticuleLayer: require('./GraticuleLayer').default,
    MarkerLayer: require('./MarkerLayer').default,
    OverlayLayer: require('./OverlayLayer').default
};
