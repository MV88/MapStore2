/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import assign from 'object-assign';

import mapConfigHistory from './MapHistory';
import undoable from 'redux-undo';
import { isEqual } from 'lodash';

const createHistory = (mapState) => {
    if (mapState && mapState.map && mapState.map.center) {
        return assign({}, mapState, {
            map: {
                past: [],
                present: mapState.map,
                future: []
            }
        });
    }
    return mapState;
};

export default {
    mapConfigHistory: (reducer) => mapConfigHistory(undoable(reducer, {
        filter: (action, currentState, previousState) => {
            let bool = false;
            if (previousState && previousState.mapStateSource && previousState.mapStateSource === 'map'
                    && previousState.center && previousState.zoom !== undefined) {
                // Check geometry part
                bool = !(isEqual(currentState.center, previousState.center) && currentState.zoom === previousState.zoom);
            }
            return bool;
        }
    })),
    createHistory
};
