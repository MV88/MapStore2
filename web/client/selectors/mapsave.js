/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createStructuredSelector } from 'reselect';
const customSaveHandlers = {};

import { selectedServiceSelector, servicesSelector } from './catalog';
import { mapInfoConfigurationSelector } from './mapInfo';
import { getCollapsedState, getFloatingWidgets, getFloatingWidgetsLayout } from './widgets';

const basicMapOptionsToSaveSelector = createStructuredSelector({
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

export const mapOptionsToSaveSelector = (state) => {
    const customState = Object.keys(customSaveHandlers).reduce((acc, fragment) => {
        return {
            ...acc,
            [fragment]: customSaveHandlers[fragment](state)
        };
    }, {});
    return { ...basicMapOptionsToSaveSelector(state), ...customState};
};

export const registerCustomSaveHandler = (section, handler) => {
    if (handler) {
        customSaveHandlers[section] = handler;
    } else {
        delete customSaveHandlers[section];
    }
};
