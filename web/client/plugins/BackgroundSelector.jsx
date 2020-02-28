/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';

import { toggleControl, setControlProperty } from '../actions/controls';
import { changeLayerProperties } from '../actions/layers';
import { createSelector } from 'reselect';

import {
    layersSelector,
    backgroundControlsSelector,
    currentBackgroundSelector,
    tempBackgroundSelector
} from '../selectors/layers';
import controlsReducers from '../reducers/controls';
import BackgroundSelector from '../components/background/BackgroundSelector';
import { mapTypeSelector } from '../selectors/maptype';
import { invalidateUnsupportedLayer } from '../utils/LayersUtils';
import { mapSelector, projectionSelector} from '../selectors/map';
import { mapLayoutValuesSelector } from '../selectors/maplayout';
import { drawerEnabledControlSelector } from '../selectors/controls';
import ROADMAP from './background/assets/img/ROADMAP.jpg';
import TERRAIN from './background/assets/img/TERRAIN.jpg';
import SATELLITE from './background/assets/img/SATELLITE.jpg';
import Aerial from './background/assets/img/Aerial.jpg';
import mapnik from './background/assets/img/mapnik.jpg';
import s2cloodless from './background/assets/img/s2cloudless.jpg';
import empty from './background/assets/img/none.jpg';
import unknown from './background/assets/img/dafault.jpg';
import Night2012 from './background/assets/img/NASA_NIGHT.jpg';
import AerialWithLabels from './background/assets/img/AerialWithLabels.jpg';
import OpenTopoMap from './background/assets/img/OpenTopoMap.jpg';

// TODO REMOVE these once they are removed from all maps see issue #3304
import HYBRID from './background/assets/img/HYBRID.jpg';

import mapquestOsm from './background/assets/img/mapquest-osm.jpg';

const thumbs = {
    google: {
        HYBRID,
        ROADMAP,
        TERRAIN,
        SATELLITE
    },
    bing: {
        Aerial,
        AerialWithLabels
    },
    osm: {
        mapnik
    },
    mapquest: {
        osm: mapquestOsm
    },
    ol: {
        "undefined": empty
    },
    nasagibs: {
        Night2012
    },
    OpenTopoMap: {
        OpenTopoMap
    },
    unknown,
    s2cloudless: {
        "s2cloudless:s2cloudless": s2cloodless
    }
};

const backgroundSelector = createSelector([
    projectionSelector,
    mapSelector,
    layersSelector,
    backgroundControlsSelector,
    drawerEnabledControlSelector,
    mapTypeSelector,
    currentBackgroundSelector,
    tempBackgroundSelector,
    state => mapLayoutValuesSelector(state, {left: true, bottom: true})
],
(projection, map, layers, controls, drawer, maptype, currentLayer, tempLayer, style) => ({
    size: map && map.size || {width: 0, height: 0},
    layers: layers.filter((l) => l && l.group === "background").map((l) => invalidateUnsupportedLayer(l, maptype)) || [],
    tempLayer,
    currentLayer,
    start: controls.start || 0,
    enabled: controls.enabled,
    style,
    projection
}));

/**
  * BackgroundSelector Plugin.
  * @class BackgroundSelector
  * @memberof plugins
  * @static
  *
  * @prop {number} cfg.left plugin position from left of the map
  * @prop {number} cfg.bottom plugin position from bottom of the map
  * @prop {object} cfg.dimensions dimensions of buttons
  * @class
  * @example
  * {
  *   "name": "BackgroundSelector",
  *   "cfg": {
  *     "dimensions": {
  *       "side": 65,
  *       "sidePreview": 65,
  *       "frame": 3,
  *       "margin": 5,
  *       "label": false,
  *       "vertical": true
  *     }
  *   }
  * }
  */

const BackgroundSelectorPlugin = connect(backgroundSelector, {
    onPropertiesChange: changeLayerProperties,
    onToggle: toggleControl.bind(null, 'backgroundSelector', null),
    onLayerChange: setControlProperty.bind(null, 'backgroundSelector'),
    onStartChange: setControlProperty.bind(null, 'backgroundSelector', 'start')
}, (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    thumbs: {
        ...thumbs,
        ...ownProps.thumbs
    }
})
)(BackgroundSelector);

export default {
    BackgroundSelectorPlugin,
    reducers: {
        controls: controlsReducers
    }
};
