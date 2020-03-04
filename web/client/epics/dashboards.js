/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Rx from 'rxjs';

import { DASHBOARD_SAVED } from '../actions/dashboard';
import {
    DASHBOARD_DELETED,
    DELETE_DASHBOARD,
    RELOAD,
    SEARCH_DASHBOARDS,
    dashboardDeleted,
    dashboardListLoaded,
    dashboardsLoading,
    searchDashboards as searchDashboardsAction
} from '../actions/dashboards';
import { ATTRIBUTE_UPDATED, MAPS_LIST_LOADING, MAP_DELETED, MAP_METADATA_UPDATED } from '../actions/maps';
import { error } from '../actions/notifications';
import GeoStoreApi from '../api/GeoStoreDAO';
import { deleteResource } from '../api/persistence';
import { wrapStartStop } from '../observables/epics';
import { searchParamsSelector, searchTextSelector, totalCountSelector } from '../selectors/dashboards';

const calculateNewParams = state => {
    const totalCount = totalCountSelector(state);
    const {start, limit, ...params} = searchParamsSelector(state) || {};
    if (start === totalCount - 1) {
        return {
            start: Math.max(0, start - limit),
            limit
        };
    }
    return {
        start, limit, ...params
    };
};

export const searchDashboardsOnMapSearch = (action$) =>
    action$.ofType(MAPS_LIST_LOADING)
        .switchMap(({ searchText }) => Rx.Observable.of(searchDashboardsAction(searchText)));

export const searchDashboards = (action$, { getState = () => { } }) =>
    action$.ofType(SEARCH_DASHBOARDS)
        .map( ({params, searchText, geoStoreUrl}) => ({
            searchText,
            options: {
                params: params || searchParamsSelector(getState()) || {start: 0, limit: 12},
                ...(geoStoreUrl ? { baseURL: geoStoreUrl } : {})
            }
        }))
        .switchMap(
            ({ searchText, options }) =>
                Rx.Observable.defer(() => GeoStoreApi.getResourcesByCategory("DASHBOARD", searchText, options))
                    .map(results => dashboardListLoaded(results, {searchText, options}))
                    .let(wrapStartStop(
                        dashboardsLoading(true, "loading"),
                        dashboardsLoading(false, "loading"),
                        () => Rx.Observable.of(error({
                            title: "notification.error",
                            message: "resources.dashboards.errorLoadingDashboards",
                            autoDismiss: 6,
                            position: "tc"
                        }))
                    ))
        );
export const deleteDashboard = action$ => action$
    .ofType(DELETE_DASHBOARD)
    .switchMap(id => deleteResource(id).map(() => dashboardDeleted(id)))
    .let(wrapStartStop(
        dashboardsLoading(true, "loading"),
        dashboardsLoading(false, "loading"),
        () => Rx.Observable.of(error({
            title: "notification.error",
            message: "resources.dashboards.deleteError",
            autoDismiss: 6,
            position: "tc"
        }))
    ));
export const reloadOnDashboards = (action$, { getState = () => { } }) =>
    action$.ofType(DASHBOARD_DELETED, MAP_DELETED, MAP_METADATA_UPDATED, RELOAD, ATTRIBUTE_UPDATED, DASHBOARD_SAVED)
        .delay(1000) // delay as a workaround for geostore issue #178
        .switchMap( () => Rx.Observable.of(searchDashboardsAction(
            searchTextSelector(getState()),
            calculateNewParams(getState())
        )));


export default {
    searchDashboardsOnMapSearch,
    searchDashboards,
    deleteDashboard,
    reloadOnDashboards
};
