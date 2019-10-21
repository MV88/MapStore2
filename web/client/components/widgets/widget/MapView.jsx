/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import autoMapType from '../../map/enhancers/autoMapType';

import mapType from '../../map/enhancers/mapType';
import autoResize from '../../map/enhancers/autoResize';
import onMapViewChanges from '../../map/enhancers/onMapViewChanges';
import { compose } from 'recompose';
export default compose(
    onMapViewChanges,
    autoResize(0),
    autoMapType,
    mapType

)(require('../../map/BaseMap'));

