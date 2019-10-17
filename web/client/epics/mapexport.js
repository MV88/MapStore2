/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Rx from 'rxjs';

import MapUtils from '../utils/MapUtils';
import {download} from '../utils/FileUtils';
import {EXPORT_MAP} from '../actions/mapexport';
import {setControlProperty} from '../actions/controls';
import {mapSelector} from '../selectors/map';
import {layersSelector, groupsSelector} from '../selectors/layers';
import {mapOptionsToSaveSelector} from '../selectors/mapsave';
const textSearchConfigSelector = state => state.searchconfig && state.searchconfig.textSearchConfig;

const PersistMap = {
    mapstore2: (state) => JSON.stringify(MapUtils.saveMapConfiguration(mapSelector(state), layersSelector(state), groupsSelector(state), textSearchConfigSelector(state), mapOptionsToSaveSelector(state)))
};


export default {
    exportMapContext: (action$, {getState = () => {}} = {} ) =>
        action$
            .ofType(EXPORT_MAP)
            .switchMap( ({format}) =>
                Rx.Observable.of(PersistMap[format](getState()))
                    .do((data) => download(data, "map.json", "application/json"))
                    .map(() => setControlProperty('export', 'enabled', false))
            )
};
