/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';

import {
    CHECK_LOGGED_USER,
    LOGIN_PROMPT_CLOSED,
    LOGIN_REQUIRED,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    RESET_ERROR,
    LOGOUT,
    SESSION_VALID,
    loginSuccess,
    loginFail,
    resetError,
    logout,
    loginRequired,
    loginPromptClosed,
    sessionValid,
    checkLoggedUser
} from '../security';


describe('Test correctness of the close actions', () => {
    it('resetError', () => {
        const retval = resetError();
        expect(retval).toExist().toIncludeKey('type');
        expect(retval.type).toBe(RESET_ERROR);
    });
    it('loginSuccess', () => {
        const retval = loginSuccess();
        expect(retval).toExist().toIncludeKey('type')
            .toIncludeKey('userDetails')
            .toIncludeKey('authHeader')
            .toIncludeKey('username')
            .toIncludeKey('password')
            .toIncludeKey('authProvider');
        expect(retval.type).toBe(LOGIN_SUCCESS);
    });
    it('loginFail', () => {
        const retval = loginFail();
        expect(retval).toExist().toIncludeKey('type')
            .toIncludeKey('error');
        expect(retval.type).toBe(LOGIN_FAIL);
    });
    it('logout', () => {
        const retval = logout();
        expect(retval).toExist().toIncludeKey('type')
            .toIncludeKey('redirectUrl');
        expect(retval.type).toBe(LOGOUT);
    });
    /* These are not exposed by the API
    it('changePasswordSuccess', () => {
        const retval = changePasswordSuccess();
        expect(retval).toExist().toIncludeKey('type')
        .toIncludeKey('user')
        .toIncludeKey('authHeader');
        expect(retval.type).toBe(CHANGE_PASSWORD_SUCCESS);
    });
    it('changePasswordFail', () => {
        const retval = changePasswordFail();
        expect(retval).toExist().toIncludeKey('type')
        .toIncludeKey('error');
        expect(retval.type).toBe(CHANGE_PASSWORD_FAIL);
    });
    */
    it('sessionValid', () => {
        const retval = sessionValid("aaa", "bbb");
        expect(retval).toExist().toIncludeKey('type')
            .toIncludeKey('userDetails')
            .toIncludeKey('authProvider');
        expect(retval.type).toBe(SESSION_VALID);
        expect(retval.userDetails).toBe("aaa");
        expect(retval.authProvider).toBe("bbb");
    });
    it('loginRequired, loginPromptClosed', () => {
        expect(loginRequired().type).toBe(LOGIN_REQUIRED);
        expect(loginPromptClosed().type).toBe(LOGIN_PROMPT_CLOSED);
    });
    it('checkLoggedUser', () => {
        expect(checkLoggedUser().type).toBe(CHECK_LOGGED_USER);
    });


});
