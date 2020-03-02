/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import MapStore2Api from '../../jsapi/MapStore2';
import * as plugins from './plugins';

const MapStore2 = MapStore2Api.withPlugins(plugins);
window.MapStore2 = MapStore2;
