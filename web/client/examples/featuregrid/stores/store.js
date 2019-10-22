/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Rx from 'rxjs';

import {
    featureTypeSelectedEpic,
    wfsQueryEpic,
    viewportSelectedEpic,
    redrawSpatialFilterEpic
} from '../../../epics/wfsquery';

import map from '../../../reducers/map';
import mapConfig from '../../../reducers/config';
import locale from '../../../reducers/locale';
import controls from '../../../reducers/controls';
import layers from '../../../reducers/layers';
import query from '../../../reducers/query';
import { getLayerFromId } from '../../../selectors/layers';
import { layerSelectedForSearch, LAYER_SELECTED_FOR_SEARCH, CLOSE_FEATURE_GRID } from '../../../actions/wfsquery';
import { browseData } from '../../../actions/layers';
import { clearChanges, setPermission, toggleTool } from '../../../actions/featuregrid';
import { hasChangesSelector, hasNewFeaturesSelector } from '../../../selectors/featuregrid';
import standardStore from '../../../stores/StandardStore';
export default (plugins) => {
    var reducers = {
        map,
        mapConfig,
        locale,
        controls,
        layers,
        query
    };

    return standardStore({}, reducers, {
        featureTypeSelectedEpic, wfsQueryEpic, viewportSelectedEpic, redrawSpatialFilterEpic,
        initLoadFeatureGridDemo: (action$, store) =>
            action$.ofType('MAP_CONFIG_LOADED', "FEATUREGRID_SAMPLE::SELECT_LAYER")
                .switchMap(({id = 'atlantis:poi'} = {}) => {
                    const state = store.getState();
                    if (hasChangesSelector(state) || hasNewFeaturesSelector(state)) {
                        return Rx.Observable.of(toggleTool("featureCloseConfirm", true))
                            .merge(action$.ofType(CLOSE_FEATURE_GRID).switchMap( () => Rx.Observable.of(
                                layerSelectedForSearch(id),
                                setPermission({canEdit: true})
                            )));
                    }
                    return Rx.Observable.of(
                        layerSelectedForSearch(id),
                        setPermission({canEdit: true})
                    );
                }),
        createFeatureGridDemoQuery: (action$, store) =>
            action$.ofType(LAYER_SELECTED_FOR_SEARCH)
                .switchMap((layer) => Rx.Observable.of(
                    clearChanges(),
                    browseData({
                        ...getLayerFromId(store.getState(), layer.id)
                    })
                ))
    }, plugins);
};
