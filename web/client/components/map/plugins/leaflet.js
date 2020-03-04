/**
* Copyright 2016, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

module.exports = () => {
    require('../leaflet/plugins/index').default;
    return {
        Map: require('../leaflet/Map').default,
        Layer: require('../leaflet/Layer').default,
        Feature: require('../leaflet/Feature').default,
        Locate: require('../leaflet/Locate').default,
        MeasurementSupport: require('../leaflet/MeasurementSupport').default,
        Overview: require('../leaflet/Overview').default,
        ScaleBar: require('../leaflet/ScaleBar').default,
        DrawSupport: require('../leaflet/DrawSupport').default
    };
};
