/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isEqual } from 'lodash';
import assign from 'object-assign';
import undoable from 'redux-undo';

import {mapConfigHistory as mapConfigHistoryStore} from './MapHistory';

export const createHistory = (mapState) => {
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

export const mapConfigHistory = (reducer) => mapConfigHistoryStore(undoable(reducer, {
    filter: (action, currentState, previousState) => {
        let bool = false;
        if (previousState && previousState.mapStateSource && previousState.mapStateSource === 'map'
                && previousState.center && previousState.zoom !== undefined) {
            // Check geometry part
            bool = !(isEqual(currentState.center, previousState.center) && currentState.zoom === previousState.zoom);
        }
        return bool;
    }
}));
