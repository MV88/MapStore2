/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Rx from 'rxjs';

import { findKey } from 'lodash';
import { MAPS_LOAD_MAP, MAPS_LIST_LOADED } from '../actions/maps';
import { DASHBOARDS_LIST_LOADED } from '../actions/dashboards';
import { GEOSTORIES_LIST_LOADED } from '../actions/geostories';
import { onTabSelected } from '../actions/contenttabs';
/**
* Update Maps, Dashboards and Geostories counts to select contenttabs each tab has to have a key in its ContentTab configuration
* @param {object} action
*/
export const updateMapsDashboardTabs = (action$, {getState = () => {}}) =>
    action$.ofType(MAPS_LOAD_MAP)
        .switchMap(() => {
            return Rx.Observable.forkJoin(action$.ofType(MAPS_LIST_LOADED).take(1), action$.ofType(DASHBOARDS_LIST_LOADED).take(1), action$.ofType(GEOSTORIES_LIST_LOADED).take(1))
                .switchMap((r) => {
                    const results = {maps: r[0].maps, dashboards: r[1], geostories: r[2]};
                    const {contenttabs = {}} = getState() || {};
                    const {selected} = contenttabs;
                    if (results[selected] && results[selected].totalCount === 0) {
                        const id = findKey(results, ({totalCount}) => totalCount > 0);
                        if (id) {
                            return Rx.Observable.of(onTabSelected(id));
                        }
                    }
                    return Rx.Observable.empty();
                });
        });


export default {updateMapsDashboardTabs};
