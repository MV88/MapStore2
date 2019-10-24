/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createStructuredSelector } from 'reselect';

import { selectedServiceSelector, servicesSelector } from './catalog';
import { mapInfoConfigurationSelector } from './mapInfo';
import { getCollapsedState, getFloatingWidgets, getFloatingWidgetsLayout } from './widgets';

export const mapOptionsToSaveSelector = createStructuredSelector({
    catalogServices: createStructuredSelector({
        services: servicesSelector,
        selectedService: selectedServiceSelector
    }),
    widgetsConfig: createStructuredSelector({
        widgets: getFloatingWidgets,
        layouts: getFloatingWidgetsLayout,
        collapsed: getCollapsedState
    }),
    mapInfoConfiguration: mapInfoConfigurationSelector
});
