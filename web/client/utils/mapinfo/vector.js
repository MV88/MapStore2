/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {getCurrentResolution} = require('../MapUtils');

module.exports = {
    buildRequest: (layer, props) => {
        return {
            request: {
                lat: props.point.latlng.lat,
                lng: props.point.latlng.lng
            },
            metadata: {
                fields: layer.features?.[0]?.properties && Object.keys(layer.features[0].properties) || [],
                title: layer.name,
                resolution: props.map && props.map && props.map.zoom && getCurrentResolution(props.map.zoom, 0, 21, 96),
                buffer: props.buffer || 2,
                units: props.map && props.map.units,
                rowViewer: layer.rowViewer,
                viewer: layer.viewer
            },
            url: ""
        };
    }
};
