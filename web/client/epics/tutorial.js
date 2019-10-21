/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Rx from 'rxjs';

import {
    START_TUTORIAL,
    UPDATE_TUTORIAL,
    INIT_TUTORIAL,
    closeTutorial,
    setupTutorial,
} from '../actions/tutorial';

import { CHANGE_MAP_VIEW } from '../actions/map';
import { MAPS_LIST_LOADED } from '../actions/maps';
import { TOGGLE_3D } from '../actions/globeswitcher';

const findTutorialId = path => path.match(/\/(viewer)\/(\w+)\/(\d+)/) && path.replace(/\/(viewer)\/(\w+)\/(\d+)/, "$2")
    || path.match(/\/(\w+)\/(\d+)/) && path.replace(/\/(\w+)\/(\d+)/, "$1")
    || path.match(/\/(\w+)\//) && path.replace(/\/(\w+)\//, "$1");
import { LOCATION_CHANGE } from 'connected-react-router';
import { isEmpty, isArray, isObject } from 'lodash';

/**
 * Closes the tutorial if 3D button has been toggled
 * @memberof epics.tutorial
 * @param {external:Observable} action$ manages `START_TUTORIAL`
 * @return {external:Observable}
 */

const closeTutorialEpic = (action$) =>
    action$.ofType(START_TUTORIAL)
        .audit(() => action$.ofType(TOGGLE_3D))
        .switchMap( () => Rx.Observable.of(closeTutorial()));

/**
 * Setup new steps based on the current path
 * @memberof epics.tutorial
 * @param {external:Observable} action$ manages `LOCATION_CHANGE`
 * @return {external:Observable}
 */

const switchTutorialEpic = (action$, store) =>
    action$.ofType(LOCATION_CHANGE)
        .filter(action =>
            action.payload
            && action.payload.location
            && action.payload.location.pathname)
        .switchMap( (action) =>
            action$.ofType(MAPS_LIST_LOADED, CHANGE_MAP_VIEW, INIT_TUTORIAL)
                .take(1)
                .switchMap( () => {
                    const id = findTutorialId(action.payload.location.pathname);
                    const state = store.getState();
                    const presetList = state.tutorial && state.tutorial.presetList || {};
                    const browser = state.browser;
                    const mobile = browser && browser.mobile ? '_mobile' : '';
                    const defaultName = id ? 'default' : action.payload && action.payload.location && action.payload.location.pathname || 'default';
                    const prevTutorialId = state.tutorial && state.tutorial.id;

                    return !isEmpty(presetList) ? Rx.Observable.of(presetList[id + mobile + '_tutorial'] ?
                        setupTutorial(id + mobile, presetList[id + mobile + '_tutorial'], null, null, null, prevTutorialId === (id + mobile)) :
                        setupTutorial(defaultName + mobile, presetList['default' + mobile + '_tutorial'], null, null, null, prevTutorialId === (defaultName + mobile))
                    ) : Rx.Observable.empty();
                })
        );

/**
 * Get actions from tutorial steps
 * @memberof epics.tutorial
 * @param {external:Observable} action$ manages `UPDATE_TUTORIAL`
 * @return {external:Observable}
 */

const getActionsFromStepEpic = (action$) =>
    action$.ofType(UPDATE_TUTORIAL)
        .filter(action => action.tour && action.tour.step && action.tour.step.action && action.tour.step.action[action.tour.action])
        .switchMap( (action) => {
            return isArray(action.tour.step.action[action.tour.action]) && Rx.Observable.of(...action.tour.step.action[action.tour.action])
            || isObject(action.tour.step.action[action.tour.action]) && Rx.Observable.of(action.tour.step.action[action.tour.action])
            || Rx.Observable.empty();
        });

/**
 * Epics for Tutorial
 * @name epics.tutorial
 * @type {Object}
 */

export default {
    closeTutorialEpic,
    switchTutorialEpic,
    getActionsFromStepEpic
};
