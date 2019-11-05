/**
 * Copyright 2015-2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
import { castArray, findIndex, get, has, isArray, merge, omit, pick } from 'lodash';

import assign from 'object-assign';
import uuidv1 from 'uuid/v1';
import xml2js from 'xml2js';
const xmlBuilder = new xml2js.Builder();

import axios from '../libs/ajax';
import ConfigUtils from '../utils/ConfigUtils';
import { registerErrorParser } from '../utils/LocaleUtils';

export const generateMetadata = (name = "", description = "") =>
    "<description><![CDATA[" + description + "]]></description>"
    + "<metadata></metadata>"
    + "<name><![CDATA[" + (name) + "]]></name>";
export const createAttributeList = (metadata = {}) => {
    const attributes = metadata.attributes || omit(metadata, ["name", "description", "id"]);

    const xmlAttrs = Object.keys(attributes).map((key) => {
        return "<attribute><name>" + key + "</name><value>" + attributes[key] + "</value><type>STRING</type></attribute>";
    });
    let attributesSection = "";
    if (xmlAttrs.length > 0) {
        attributesSection = "<Attributes>" + xmlAttrs.join("") + "</Attributes>";
    }
    return attributesSection;
};
let parseOptions = (opts) => opts;

let parseAdminGroups = (groupsObj) => {
    if (!groupsObj || !groupsObj.UserGroupList || !groupsObj.UserGroupList.UserGroup) return [];

    const pickFromObj = (obj) => pick(obj, ["id", "groupName", "description"]);
    if (isArray(groupsObj.UserGroupList.UserGroup)) {
        return groupsObj.UserGroupList.UserGroup.filter(obj => !!obj.id).map(pickFromObj);
    }
    return [pickFromObj(groupsObj.UserGroupList.UserGroup)];
};

let parseUserGroups = (groupsObj) => {
    if (!groupsObj || !groupsObj.User || !groupsObj.User.groups || !groupsObj.User.groups.group || !isArray(groupsObj.User.groups.group)) {
        if (has(groupsObj.User.groups.group, "id", "groupName")) {
            return [groupsObj.User.groups.group];
        }
        return [];
    }
    return groupsObj.User.groups.group.filter(obj => !!obj.id).map((obj) => pick(obj, ["id", "groupName", "description"]));
};

const boolToString = (b) => b ? "true" : "false";

export const errorParser = {
    /**
     * Returns localized message for geostore map errors
     * @param  {object} e error object
     * @return {object} {title, message}
     */
    mapsError: e => {
        if (e.status === 403 || e.status === 404 || e.status === 409 || e.status === 500) {
            return {
                title: 'map.mapError.errorTitle',
                message: 'map.mapError.error' + e.status
            };
        }
        return {
            title: 'map.mapError.errorTitle',
            message: 'map.mapError.errorDefault'
        };
    }
};

registerErrorParser('geostore', {...errorParser});

/**
 * API for local config
 */

export const utils = {
    /**
     * initialize User with newPassword and UUID
     * @param  {object} user The user object
     * @return {object}      The user object adapted for creation (newPassword, UUID)
     */
    initUser: (user) => {
        const postUser = assign({}, user);
        if (postUser.newPassword) {
            postUser.password = postUser.newPassword;
        }
        // uuid is time-based
        const uuidAttr = {
            name: "UUID", value: uuidv1()
        };
        postUser.attribute = postUser.attribute && postUser.attribute.length > 0 ? [...postUser.attribute, uuidAttr] : [uuidAttr];
        return postUser;
    }
};

export const authProviderName = "geostore";
/**
 * add the geostore base url, default is /mapstore/rest/geostore/
 * @param {object} options axios options
 * @return {object} options with baseURL
 */
export const addBaseUrl = function(options) {
    return assign({}, options, {baseURL: options && options.baseURL || ConfigUtils.getDefaults().geoStoreUrl});
};
export const getData = function(id, options) {
    const url = "data/" + id;
    return axios.get(url, this.addBaseUrl(parseOptions(options))).then(function(response) {
        return response.data;
    });
};
export const getResource = function(resourceId, options) {
    return axios.get(
        "resources/resource/" + resourceId,
        this.addBaseUrl(parseOptions(options))).then(function(response) {return response.data; });
};
export const getShortResource = function(resourceId, options) {
    return axios.get(
        "extjs/resource/" + resourceId,
        this.addBaseUrl(parseOptions(options))).then(function(response) { return response.data; });
};
export const getResourcesByCategory = function(category, query, options) {
    const q = query || "*";
    const url = "extjs/search/category/" + category + "/*" + q + "*/thumbnail,details,featured"; // comma-separated list of wanted attributes
    return axios.get(url, this.addBaseUrl(parseOptions(options))).then(function(response) {return response.data; });
};
export const getUserDetails = function(username, password, options) {
    const url = "users/user/details";
    return axios.get(url, this.addBaseUrl(merge({
        auth: {
            username: username,
            password: password
        },
        params: {
            includeattributes: true
        }
    }, options))).then(function(response) {
        return response.data;
    });
};
export const login = function(username, password, options) {
    const url = "session/login";
    let authData;
    return axios.post(url, null, this.addBaseUrl(merge((username && password) ? {
        auth: {
            username: username,
            password: password
        }
    } : {}, options))).then((response) => {
        authData = response.data;
        return axios.get("users/user/details", this.addBaseUrl(merge({
            headers: {
                'Authorization': 'Bearer ' + response.data.access_token
            },
            params: {
                includeattributes: true
            }
        }, options)));
    }).then((response) => {
        return { ...response.data, ...authData};
    });
};
export const changePassword = function(user, newPassword, options) {
    return axios.put(
        "users/user/" + user.id, "<User><newPassword>" + newPassword + "</newPassword></User>",
        this.addBaseUrl(merge({
            headers: {
                'Content-Type': "application/xml"
            }
        }, options)));
};
export const updateResourceAttribute = function(resourceId, name, value, type, options) {
    return axios.put(
        "resources/resource/" + resourceId + "/attributes/" + name + "/" + value, null,
        this.addBaseUrl(merge({
            headers: {
                'Content-Type': "application/xml"
            }
        }, options)));
};
export const getResourceAttribute = function(resourceId, name, options = {}) {
    return axios.get(
        "resources/resource/" + resourceId + "/attributes/" + name,
        this.addBaseUrl(merge({
            headers: {
                'Content-Type': "application/xml"
            }
        }, options)));
};
export const getResourceAttributes = function(resourceId, options = {}) {
    return axios.get(
        "resources/resource/" + resourceId + "/attributes",
        this.addBaseUrl({
            headers: {
                'Accept': "application/json"
            },
            ...options
        })).then(({ data } = {}) => data)
        .then(data => castArray(get(data, "AttributeList.Attribute") || []))
        .then(attributes => attributes || []);
};
export const getPermissions = function(mapId, options) {
    const url = "resources/resource/" + mapId + "/permissions";
    return axios.get(url, this.addBaseUrl(parseOptions(options))).then(function(response) {return response.data; });
};
/**
 * same of getPermissions but clean data properly and returns only the array of rules.
 */
export const getResourcePermissions = function(resourceId, options, withSelector = true) {
    return getPermissions(resourceId, options)
        .then(rl => castArray( withSelector ? get(rl, 'SecurityRuleList.SecurityRule') : rl))
        .then(rules => (rules && rules[0] && rules[0] !== "") ? rules : []);
};
export const putResourceMetadata = function(resourceId, newName, newDescription, options) {
    return axios.put(
        "resources/resource/" + resourceId,
        "<Resource>" + generateMetadata(newName, newDescription) + "</Resource>",
        this.addBaseUrl(merge({
            headers: {
                'Content-Type': "application/xml"
            }
        }, options)));
};
export const putResourceMetadataAndAttributes = function(resourceId, metadata, options) {
    return axios.put(
        "resources/resource/" + resourceId,
        "<Resource>" + generateMetadata(metadata.name, metadata.description) + createAttributeList(metadata) + "</Resource>",
        this.addBaseUrl(merge({
            headers: {
                'Content-Type': "application/xml"
            }
        }, options)));
};
export const putResource = function(resourceId, content, options) {
    return axios.put(
        "data/" + resourceId,
        content,
        this.addBaseUrl(merge({
            headers: {
                'Content-Type': typeof content === 'string' ? "text/plain; charset=utf-8" : 'application/json; charset=utf-8"'
            }
        }, options)));
};
export const writeSecurityRules = function(SecurityRuleList = {}) {
    return "<SecurityRuleList>" +
    (castArray(SecurityRuleList.SecurityRule) || []).map( rule => {
        if (rule.canRead || rule.canWrite) {
            if (rule.user) {
                return "<SecurityRule>"
                    + "<canRead>" + boolToString(rule.canRead || rule.canWrite) + "</canRead>"
                    + "<canWrite>" + boolToString(rule.canWrite) + "</canWrite>"
                    + "<user><id>" + (rule.user.id || "") + "</id><name>" + (rule.user.name || "") + "</name></user>"
                    + "</SecurityRule>";
            } else if (rule.group) {
                return "<SecurityRule>"
                    + "<canRead>" + boolToString(rule.canRead || rule.canWrite) + "</canRead>"
                    + "<canWrite>" + boolToString(rule.canWrite) + "</canWrite>"
                    + "<group><id>" + (rule.group.id || "") + "</id><groupName>" + (rule.group.groupName || "") + "</groupName></group>"
                    + "</SecurityRule>";
            }
            // NOTE: if rule has no group or user, it is skipped
            // NOTE: if rule is "no read and no write", it is skipped
        }
        return "";
    }).join('') + "</SecurityRuleList>";
};
export const updateResourcePermissions = function(resourceId, securityRules) {
    const payload = writeSecurityRules(securityRules.SecurityRuleList);
    return axios.post(
        "resources/resource/" + resourceId + "/permissions",
        payload,
        this.addBaseUrl({
            headers: {
                'Content-Type': "application/xml"
            }
        }));
};
export const createResource = function(metadata, data, category, options) {
    const name = metadata.name;
    const description = metadata.description || "";
    // filter attributes from the metadata object excluding the default ones
    const attributesSection = createAttributeList(metadata);
    return axios.post(
        "resources/",
        "<Resource>" + generateMetadata(name, description) + "<category><name>" + (category || "") + "</name></category>" +
            attributesSection +
            "<store><data><![CDATA[" + (
            data
                    && (
                        (typeof data === 'object')
                            ? JSON.stringify(data)
                            : data)
                    || "") + "]]></data></store></Resource>",
        this.addBaseUrl(merge({
            headers: {
                'Content-Type': "application/xml"
            }
        }, options)));
};
export const deleteResource = function(resourceId, options) {
    return axios.delete(
        "resources/resource/" + resourceId,
        this.addBaseUrl(merge({
        }, options)));
};
export const getUserGroups = function(options) {
    const url = "usergroups/";
    return axios.get(url, this.addBaseUrl(parseOptions(options))).then(function(response) {
        return response.data;
    });
};
export const getAvailableGroups = function(user) {
    if (user && user.role === "ADMIN") {
        return axios.get(
            "usergroups/?all=true",
            this.addBaseUrl({
                headers: {
                    'Accept': "application/json"
                }
            })).then(function(response) {
            return parseAdminGroups(response.data);
        });
    }
    return axios.get(
        "users/user/details",
        this.addBaseUrl({
            headers: {
                'Accept': "application/json"
            }
        })).then(function(response) {
        return parseUserGroups(response.data);
    });
};
export const getUsers = function(textSearch, options = {}) {
    const url = "extjs/search/users" + (textSearch ? "/" + textSearch : "");
    return axios.get(url, this.addBaseUrl(parseOptions(options))).then(function(response) {return response.data; });
};
export const getUser = function(id, options = {params: {includeattributes: true}}) {
    const url = "users/user/" + id;
    return axios.get(url, this.addBaseUrl(parseOptions(options))).then(function(response) {return response.data; });
};
export const updateUser = function(id, user, options) {
    const url = "users/user/" + id;
    const postUser = assign({}, user);
    if (postUser.newPassword === "") {
        delete postUser.newPassword;
    }
    return axios.put(url, {User: postUser}, this.addBaseUrl(parseOptions(options))).then(function(response) {return response.data; });
};
export const createUser = function(user, options) {
    const url = "users/";

    return axios.post(url, {User: utils.initUser(user)}, this.addBaseUrl(parseOptions(options))).then(function(response) {return response.data; });
};
export const deleteUser = function(id, options = {}) {
    const url = "users/user/" + id;
    return axios.delete(url, this.addBaseUrl(parseOptions(options))).then(function(response) {return response.data; });
};
export const getGroups = function(textSearch, options = {}) {
    const url = "extjs/search/groups" + (textSearch ? "/" + textSearch : "");
    return axios.get(url, this.addBaseUrl(parseOptions(options))).then(function(response) {return response.data; });
};
export const getGroup = function(id, options = {}) {
    const url = "usergroups/group/" + id;
    return axios.get(url, this.addBaseUrl(parseOptions(options))).then(function(response) {
        let groupLoaded = response.data.UserGroup;
        let users = groupLoaded && groupLoaded.restUsers && groupLoaded.restUsers.User;
        return {...groupLoaded, users: users && (Array.isArray(users) ? users : [users]) || []};
    });
};

export const updateGroupMembers = function(group, options) {
    // No GeoStore API to update group name and description. only update new users
    if (group.newUsers) {
        let restUsers = group.users || group.restUsers && group.restUsers.User || [];
        restUsers = Array.isArray(restUsers) ? restUsers : [restUsers];
        // old users not present in the new users list
        let toRemove = restUsers.filter( (user) => findIndex(group.newUsers, u => u.id === user.id) < 0);
        // new users not present in the old users list
        let toAdd = group.newUsers.filter( (user) => findIndex(restUsers, u => u.id === user.id) < 0);

        // create callbacks
        let removeCallbacks = toRemove.map( (user) => () => this.removeUserFromGroup(user.id, group.id, options) );
        let addCallbacks = toAdd.map( (user) => () => this.addUserToGroup(user.id, group.id), options );
        let requests = [...removeCallbacks.map( call => call.call(this)), ...addCallbacks.map(call => call())];
        return axios.all(requests).then(() => {
            return {
                ...group,
                newUsers: null,
                restUsers: { User: group.newUsers},
                users: group.newUsers
            };
        });
    }
    return new Promise( (resolve) => {
        resolve({
            ...group
        });
    });
};
export const createGroup = function(group, options) {
    const url = "usergroups/";
    let groupId;
    return axios.post(url, {UserGroup: {...group}}, this.addBaseUrl(parseOptions(options)))
        .then(function(response) {
            groupId = response.data;
            return updateGroupMembers({...group, id: groupId}, options);
        }).then(() => groupId);
};
export const deleteGroup = function(id, options = {}) {
    const url = "usergroups/group/" + id;
    return axios.delete(url, this.addBaseUrl(parseOptions(options))).then(function(response) {return response.data; });
};
export const addUserToGroup = function(userId, groupId, options = {}) {
    const url = "/usergroups/group/" + userId + "/" + groupId + "/";
    return axios.post(url, null, this.addBaseUrl(parseOptions(options)));
};
export const removeUserFromGroup = function(userId, groupId, options = {}) {
    const url = "/usergroups/group/" + userId + "/" + groupId + "/";
    return axios.delete(url, this.addBaseUrl(parseOptions(options)));
};
export const verifySession = function(options) {
    const url = "users/user/details";
    return axios.get(url, this.addBaseUrl(merge({
        params: {
            includeattributes: true
        }
    }, options))).then(function(response) {
        return response.data;
    });
};
export const refreshToken = function(accessToken, refreshingToken, options) {
    // accessToken is actually the sessionID
    const url = "session/refresh/" + accessToken + "/" + refreshingToken;
    return axios.post(url, null, this.addBaseUrl(parseOptions(options))).then(function(response) {
        return response.data;
    });
};
/**
 * send a request to /extjs/search/list
 * @param  {object} filters
 * @param  {object} options additional axios options
 * @return {object}
 * @example
 *
 *  const filters = {
 *      AND: {
 *          ATTRIBUTE: [
 *              {
 *                  name: ['featured'],
 *                  operator: ['EQUAL_TO'],
 *                  type: ['STRING'],
 *                  value: [true]
 *              }
 *          ]
 *      }
 *  }
 *
 *  searchListByAttributes(filters)
 *      .then(results => results)
 *      .catch(error => error);
 *
 */
export const searchListByAttributes = (filter, options) => {
    const url = "/extjs/search/list";
    const xmlFilter = xmlBuilder.buildObject(filter);
    return axios.post(
        url,
        xmlFilter,
        addBaseUrl({
            ...parseOptions(options),
            headers: {
                "Content-Type": "application/xml",
                "Accept": "application/json"
            }
        })
    )
        .then(response => response.data);
};

const Api = {
    addBaseUrl,
    addUserToGroup,
    authProviderName,
    changePassword,
    createAttributeList,
    createGroup,
    createResource,
    createUser,
    deleteGroup,
    deleteResource,
    deleteUser,
    errorParser,
    generateMetadata,
    getAvailableGroups,
    getData,
    getGroup,
    getGroups,
    getPermissions,
    getResource,
    getResourceAttribute,
    getResourceAttributes,
    getResourcePermissions,
    getResourcesByCategory,
    getShortResource,
    getUser,
    getUserDetails,
    getUserGroups,
    getUsers,
    login,
    putResource,
    putResourceMetadata,
    putResourceMetadataAndAttributes,
    refreshToken,
    removeUserFromGroup,
    searchListByAttributes,
    updateGroupMembers,
    updateResourceAttribute,
    updateResourcePermissions,
    updateUser,
    utils,
    verifySession,
    writeSecurityRules
};

export default Api;
