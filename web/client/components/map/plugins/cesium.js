/**
* Copyright 2016, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/
import { createSink } from 'recompose';

export default async() => {
    import('../cesium/plugins/index');
    const Map = await import(
        /* webpackChunkName: "cesium_Map" */
        '../cesium/Map');
    const Layer = await import(
        /* webpackChunkName: "cesium_Layer" */
        '../cesium/Layer');

    return {
        Map,
        Layer,
        Feature: createSink(() => {})
    };
};
