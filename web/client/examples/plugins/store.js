/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { combineReducers, combineEpics } from '../../utils/PluginsUtils';

import { createDebugStore } from '../../utils/DebugUtils';
import LayersUtils from '../../utils/LayersUtils';
import { createEpicMiddleware } from 'redux-observable';
import map from '../../reducers/map';
import layers from '../../reducers/layers';
import mapConfig from '../../reducers/config';
import locale from '../../reducers/locale';
import browser from '../../reducers/browser';
import theme from '../../reducers/theme';
import pluginsConfig from './reducers/config';
import controlsEpics from '../../epics/controls';

export default (plugins, custom) => {
    const allReducers = combineReducers(plugins, {
        locale,
        browser,
        theme,
        map: () => {return null; },
        mapInitialConfig: () => {return null; },
        layers: () => {return null; },
        pluginsConfig,
        custom
    });
    const standardEpics = {
        ...controlsEpics
    };
    const rootEpic = combineEpics(plugins, {...standardEpics });
    const epicMiddleware = createEpicMiddleware(rootEpic);

    const rootReducer = (state, action) => {
        if (action.type === 'LOADED_STATE') {
            return action.state;
        }
        let mapState = LayersUtils.splitMapAndLayers(mapConfig(state, action));
        let newState = {
            ...allReducers(state, action),
            map: mapState && mapState.map ? map(mapState.map, action) : null,
            mapInitialConfig: mapState ? mapState.mapInitialConfig : null,
            layers: mapState ? layers(mapState.layers, action) : null
        };
        return newState;
    };

    return createDebugStore(rootReducer, {}, [epicMiddleware]);
};
