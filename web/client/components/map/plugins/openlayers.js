/**
* Copyright 2016, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import DrawSupport from '../openlayers/DrawSupport';
import Feature from '../openlayers/Feature';
import Layer from '../openlayers/Layer';
import Locate from '../openlayers/Locate';
import Map from '../openlayers/Map';
import MeasurementSupport from '../openlayers/MeasurementSupport';
import Overview from '../openlayers/Overview';
import ScaleBar from '../openlayers/ScaleBar';
import * as openlayersPlugins from '../openlayers/plugins/index';

export default () => {
    return {
        ...openlayersPlugins,
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
