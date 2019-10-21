/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { refreshAccessToken, sessionValid, logout, LOGIN_SUCCESS, LOGOUT } from '../actions/security';

import { DASHBOARD_LOAD_ERROR } from '../actions/dashboard';
import { LOAD_GEOSTORY_ERROR } from '../actions/geostory';
import { loadMapConfig, configureError, MAP_CONFIG_LOAD_ERROR } from '../actions/config';
import { mapIdSelector } from '../selectors/map';
import { hasMapAccessLoadingError } from '../selectors/mapInitialConfig';
import { initCatalog } from '../actions/catalog';
import { setControlProperty, SET_CONTROL_PROPERTY } from '../actions/controls';
import { pathnameSelector } from '../selectors/router';
import { isLoggedIn } from '../selectors/security';
import ConfigUtils from '../utils/ConfigUtils';
import AuthenticationAPI from '../api/GeoStoreDAO';
import Rx from 'rxjs';
import { LOCATION_CHANGE, push } from 'connected-react-router';
import url from 'url';
import { get } from 'lodash';
import { feedbackMaskLoading } from '../actions/feedbackMask';

/**
 * Refresh the access_token every 5 minutes
 * @memberof epics.login
 * @return {external:Observable} emitting {@link #actions.security.refreshAccessToken} events
 */
const refreshTokenEpic = (action$, store) =>
    action$.ofType(LOCATION_CHANGE)
        .take(1)
        // do not launch the session verify is there is no stored session
        .switchMap(() => (get(store.getState(), "security.user") ?
            Rx.Observable.fromPromise(AuthenticationAPI.verifySession())
                .map(
                    (response) => sessionValid(response, AuthenticationAPI.authProviderName)
                )
                .catch(() => Rx.Observable.of(logout(null))) : Rx.Observable.empty()
        )
            .merge(Rx.Observable
                .interval(300000 /* ms */)
                .filter(() => get(store.getState(), "security.user"))
                .mapTo(refreshAccessToken()))
        );


const reloadMapConfig = (action$, store) =>
    Rx.Observable.merge(
        action$.ofType(LOGIN_SUCCESS, LOGOUT)
            .filter(() => pathnameSelector(store.getState()).indexOf("viewer") !== -1)
            .filter((data) => data.type !== "LOGOUT" ? hasMapAccessLoadingError(store.getState()) : pathnameSelector(store.getState()).indexOf("new") === -1)
            .map(() => mapIdSelector(store.getState())),
        action$.ofType(LOGOUT)
            .filter(() => pathnameSelector(store.getState()).indexOf("viewer") !== -1 && pathnameSelector(store.getState()).indexOf("new") !== -1)
            .map(() => 'new')
    )
        .switchMap((mapId) => {
            const urlQuery = url.parse(window.location.href, true).query;
            let config = urlQuery && urlQuery.config || null;
            const { configUrl } = ConfigUtils.getConfigUrl({ mapId, config });
            return Rx.Observable.of(loadMapConfig(configUrl, mapId !== 'new' ? mapId : null ));
        }).catch((e) => {
            return Rx.Observable.of(configureError(e));
        });

const promptLoginOnMapError = (actions$, store) =>
    actions$.ofType(MAP_CONFIG_LOAD_ERROR, DASHBOARD_LOAD_ERROR, LOAD_GEOSTORY_ERROR)
        .filter( (action) => action.error && action.error.status === 403 && !isLoggedIn(store.getState()))
        .switchMap(() => {
            return Rx.Observable.of(setControlProperty('LoginForm', 'enabled', true))
            // send to homepage if close is pressed on login modal
                .merge(
                    actions$.ofType(SET_CONTROL_PROPERTY)
                        .filter(actn => actn.control === 'LoginForm' && actn.property === 'enabled' && actn.value === false && !isLoggedIn(store.getState()))
                        .exhaustMap(() => Rx.Observable.of(feedbackMaskLoading(), push('/')))
                        .takeUntil(actions$.ofType(LOGIN_SUCCESS))
                );
        });

const initCatalogOnLoginOutEpic = (action$) =>
    action$.ofType(LOGIN_SUCCESS, LOGOUT)
        .switchMap(() => {
            return Rx.Observable.of(initCatalog());
        });

/**
 * Epics for login functionality
 * @name epics.login
 * @type {Object}
 */
export default {
    refreshTokenEpic,
    reloadMapConfig,
    promptLoginOnMapError,
    initCatalogOnLoginOutEpic
};
