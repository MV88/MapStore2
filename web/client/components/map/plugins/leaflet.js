/**
* Copyright 2016, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import DrawSupport from '../leaflet/DrawSupport';
import Feature from '../leaflet/Feature';
import Layer from '../leaflet/Layer';
import Locate from '../leaflet/Locate';
import Map from '../leaflet/Map';
import MeasurementSupport from '../leaflet/MeasurementSupport';
import Overview from '../leaflet/Overview';
import ScaleBar from '../leaflet/ScaleBar';
import * as leafletPlugins from '../leaflet/plugins/index';

export default () => {
    return {
        ...leafletPlugins,
        Map,
        Layer,
        Feature,
        Locate,
        MeasurementSupport,
        Overview,
        ScaleBar,
        DrawSupport
    };
};
