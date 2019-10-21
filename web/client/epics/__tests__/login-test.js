/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';

import { INIT_CATALOG } from '../../actions/catalog';
import { SET_CONTROL_PROPERTY, setControlProperty } from '../../actions/controls';
import { loginSuccess, logout, logoutWithReload } from '../../actions/security';
import { initCatalogOnLoginOutEpic, promptLoginOnMapError, reloadMapConfig } from '../login';
import { configureError } from '../../actions/config';
import { dashboardLoadError } from '../../actions/dashboard';
import { loadGeostoryError } from '../../actions/geostory';
import { FEEDBACK_MASK_LOADING } from '../../actions/feedbackMask';
import { testEpic } from './epicTestUtils';

describe('login Epics', () => {
    it('init catalog on login', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            const action = actions[0];
            expect(action.type).toBe(INIT_CATALOG);
            done();
        };
        testEpic(initCatalogOnLoginOutEpic, 1, loginSuccess(), epicResult, {});
    });
    it('keeps map changes on login', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(0);
            done();
        };
        testEpic(reloadMapConfig, 0, loginSuccess(), epicResult, {});
    });
    it('removes unsaved map changes on logout', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(0);
            done();
        };
        testEpic(reloadMapConfig, 0, logoutWithReload(), epicResult, {});
    });

    it('reload new map config on logout', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            done();
        };
        const state = {
            router: {
                location: {
                    pathname: "/viewer/openlayers/new"
                }
            }
        };
        testEpic(reloadMapConfig, 1, logout(null), epicResult, state);
    });

    it('init catalog on logout', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            const action = actions[0];
            expect(action.type).toBe(INIT_CATALOG);
            done();
        };
        testEpic(initCatalogOnLoginOutEpic, 1, logout(), epicResult, {});
    });
    // TODO: move these tests in feedback mask and/or on single plugins
    describe('prompt login on not-public resources', () => {
        it('not-public map', (done) => {
            const e = {
                status: 403
            };
            const epicResult = actions => {
                expect(actions.length).toBe(1);
                const action = actions[0];
                expect(action.type).toBe(SET_CONTROL_PROPERTY);
                done();
            };
            testEpic(promptLoginOnMapError, 1, configureError(e, 123), epicResult, {});
        });
        it('not-public dashboard', (done) => {
            const error = {
                status: 403
            };
            const epicResult = actions => {
                try {
                    expect(actions.length).toBe(3);
                    const setControlAction = actions[0];
                    expect(setControlAction.type).toBe(SET_CONTROL_PROPERTY);
                    expect(setControlAction.control).toBe('LoginForm');
                    expect(setControlAction.property).toBe('enabled');
                    const feedbackAction = actions[1];
                    expect(feedbackAction.type).toBe(FEEDBACK_MASK_LOADING);
                    const pushAction = actions[2];
                    expect(pushAction.type).toBe('@@router/CALL_HISTORY_METHOD');
                    expect(pushAction.payload).toEqual({ method: 'push', args: ['/'] });
                } catch (e) {
                    done(e);
                }
                done();
            };
            testEpic(promptLoginOnMapError, 3, [dashboardLoadError(error), setControlProperty('LoginForm', 'enabled', false)], epicResult, {});
        });
        it('not-public story', (done) => {
            const error = {
                status: 403
            };
            const epicResult = actions => {
                try {
                    expect(actions.length).toBe(3);
                    const setControlAction = actions[0];
                    expect(setControlAction.type).toBe(SET_CONTROL_PROPERTY);
                    expect(setControlAction.control).toBe('LoginForm');
                    expect(setControlAction.property).toBe('enabled');
                    const feedbackAction = actions[1];
                    expect(feedbackAction.type).toBe(FEEDBACK_MASK_LOADING);
                    const pushAction = actions[2];
                    expect(pushAction.type).toBe('@@router/CALL_HISTORY_METHOD');
                    expect(pushAction.payload).toEqual({ method: 'push', args: ['/'] });
                } catch (e) {
                    done(e);
                }
                done();
            };
            testEpic(promptLoginOnMapError, 3, [loadGeostoryError(error), setControlProperty('LoginForm', 'enabled', false)], epicResult, {});
        });
    });
});
