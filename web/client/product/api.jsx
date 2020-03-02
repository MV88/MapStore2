/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MapStore2API from '../jsapi/MapStore2';
import apiPlugins from './apiPlugins';
import {initialState} from './appConfigEmbedded';

const getScriptPath = () => {
    const scriptEl = document.getElementById('ms2-api');
    return scriptEl && scriptEl.src && scriptEl.src.substring(0, scriptEl.src.lastIndexOf('/')) || 'https://dev.mapstore.geo-solutions.it/mapstore/dist';
};

const MapStore2 = MapStore2API
    .withPlugins(apiPlugins, {
        theme: {
            path: getScriptPath() + '/themes'
        },
        noLocalConfig: true,
        initialState,
        translations: getScriptPath() + '/../translations'
    });
window.MapStore2 = MapStore2;
