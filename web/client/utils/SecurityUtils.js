/**
import { keys } from 'lodash';
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {setStore as setStoreStateUtils, getState} from './StateUtils';
import ConfigUtils from './ConfigUtils';

import URL from 'url';
import assign from 'object-assign';
import { head, isNil } from 'lodash';

export let SecurityUtils = {};
/**
 * This utility class will get information about the current logged user directly from the store.
 */

/**
 * Stores the logged user security information.
 */
export const setStore = (store) => {
    setStoreStateUtils(store);
};

/**
 * Gets security state form the store.
 */
export const getSecurityInfo = () => {
    return getState().security || {};
};

/**
 * Returns the current user or undefined if not available.
 */
export const getUser = () => {
    const securityInfo = SecurityUtils.getSecurityInfo();
    return securityInfo && securityInfo.user;
};

/**
 * Returns the current user basic authentication header value.
 */
export const getBasicAuthHeader = () => {
    const securityInfo = SecurityUtils.getSecurityInfo();
    return securityInfo && securityInfo.authHeader;
};

/**
 * Returns the current user access token value.
 */
export const getToken = () => {
    const securityInfo = SecurityUtils.getSecurityInfo();
    return securityInfo && securityInfo.token;
};

/**
 * Returns the current user refresh token value.
 * The refresh token is used to get a new access token.
 */
export const getRefreshToken = () => {
    const securityInfo = SecurityUtils.getSecurityInfo();
    return securityInfo && securityInfo.refresh_token;
};

/**
 * Return the user attributes as an array. If the user is undefined or
 * doesn't have any attributes an empty array is returned.
 */
export const getUserAttributes = function(providedUser) {
    const user = providedUser ? providedUser : SecurityUtils.getUser();
    if (!user || !user.attribute) {
        // not user defined or the user doesn't have any attributes
        return [];
    }
    let attributes = user.attribute;
    // if the user has only one attribute we need to put it in an array
    return Array.isArray(attributes) ? attributes : [attributes];
};

/**
 * Search in the user attributes an attribute that matches the provided
 * attribute name. The search will not be case sensitive. Undefined is
 * returned if the attribute could not be found.
 */
export const findUserAttribute = function(attributeName) {
    // getting the user attributes
    let userAttributes = SecurityUtils.getUserAttributes();
    if (!userAttributes || !attributeName ) {
        // the user as no attributes or the provided attribute name is undefined
        return null;
    }
    return head(userAttributes.filter(attribute => attribute.name
        && attribute.name.toLowerCase() === attributeName.toLowerCase()));
};

/**
 * Search in the user attributes an attribute that matches the provided
 * attribute name. The search will not be case sensitive. Undefined is
 * returned if the attribute could not be found otherwise the attribute
 * value is returned.
 */
export const findUserAttributeValue = function(attributeName) {
    let userAttribute = SecurityUtils.findUserAttribute(attributeName);
    return userAttribute && userAttribute.value;
};

/**
 * Returns an array with the configured authentication rules. If no rules
 * were configured an empty array is returned.
 */
export const getAuthenticationRules = function() {
    return ConfigUtils.getConfigProp('authenticationRules') || [];
};

/**
 * Checks if authentication is activated or not.
 */
export const isAuthenticationActivated = function() {
    return ConfigUtils.getConfigProp('useAuthenticationRules') || false;
};

/**
 * Returns the authentication method that should be used for the provided URL.
 * We go through the authentication rules and find the first one that matches
 * the provided URL, if no rule matches the provided URL undefined is returned.
 */
export const getAuthenticationMethod = function(url) {
    const foundRule = head(SecurityUtils.getAuthenticationRules().filter(
        rule => rule && rule.urlPattern && url.match(new RegExp(rule.urlPattern, "i"))));
    return foundRule ? foundRule.method : undefined;
};

/**
 * Returns the authentication rule that should be used for the provided URL.
 * We go through the authentication rules and find the first one that matches
 * the provided URL, if no rule matches the provided URL undefined is returned.
 */
export const getAuthenticationRule = function(url) {
    return head(SecurityUtils.getAuthenticationRules().filter(
        rule => rule && rule.urlPattern && url.match(new RegExp(rule.urlPattern, "i"))));
};

/**
 * This method will add query parameter based authentications to an url.
 */
export const addAuthenticationToUrl = function(url) {
    if (!url || !SecurityUtils.isAuthenticationActivated()) {
        return url;
    }
    const parsedUrl = URL.parse(url, true);
    parsedUrl.query = SecurityUtils.addAuthenticationParameter(url, parsedUrl.query);
    // we need to remove this to force the use of query
    delete parsedUrl.search;
    return URL.format(parsedUrl);
};

/**
 * This method will add query parameter based authentications to an object
 * containing query parameters.
 */
export const addAuthenticationParameter = function(url, parameters, securityToken) {
    if (!url || !SecurityUtils.isAuthenticationActivated()) {
        return parameters;
    }
    switch (SecurityUtils.getAuthenticationMethod(url)) {
    case 'authkey': {
        const token = !isNil(securityToken) ? securityToken : SecurityUtils.getToken();
        if (!token) {
            return parameters;
        }
        const authParam = SecurityUtils.getAuthKeyParameter(url);
        return assign(parameters || {}, {[authParam]: token});
    }
    case 'test': {
        const rule = getAuthenticationRule(url);
        const token = rule ? rule.token : "";
        const authParam = SecurityUtils.getAuthKeyParameter(url);
        return assign(parameters || {}, { [authParam]: token });
    }
    default:
        // we cannot handle the required authentication method
        return parameters;
    }
};
export const clearNilValuesForParams = (params = {}) => {
    return Object.keys(params).reduce((pre, cur) => {
        return !isNil(params[cur]) ? {...pre, [cur]: params[cur]} : pre;
    }, {});
};
export const addAuthenticationToSLD = function(layerParams, options) {
    if (layerParams.SLD) {
        const parsed = URL.parse(layerParams.SLD, true);
        const params = SecurityUtils.addAuthenticationParameter(layerParams.SLD, parsed.query, options.securityToken);
        return assign({}, layerParams, {
            SLD: URL.format(assign({}, parsed, {
                query: params,
                search: undefined
            }))
        });
    }
    return layerParams;
};
export const getAuthKeyParameter = function(url) {
    const foundRule = getAuthenticationRule(url);
    return foundRule && foundRule.authkeyParamName ? foundRule.authkeyParamName : 'authkey';
};
export const cleanAuthParamsFromURL = (url) => ConfigUtils.filterUrlParams(url, [SecurityUtils.getAuthKeyParameter(url)].filter(p => p));

SecurityUtils = {
    setStore,
    getSecurityInfo,
    getUser,
    getBasicAuthHeader,
    getToken,
    getRefreshToken,
    getUserAttributes,
    findUserAttribute,
    findUserAttributeValue,
    getAuthenticationRules,
    isAuthenticationActivated,
    getAuthenticationMethod,
    getAuthenticationRule,
    addAuthenticationToUrl,
    addAuthenticationParameter,
    clearNilValuesForParams,
    addAuthenticationToSLD,
    getAuthKeyParameter,
    cleanAuthParamsFromURL

};

export default SecurityUtils;
