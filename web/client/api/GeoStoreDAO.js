/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const axios = require('../libs/ajax');
const _ = require('lodash');
const assign = require('object-assign');

const ConfigUtils = require('../utils/ConfigUtils');

var parseOptions = (opts) => opts;
/**
 * API for local config
 */
var Api = {
    getData: function(id, options) {
        let url = "data/" + id;
        return axios.get(url, this.addBaseUrl(parseOptions(options))).then(function(response) {
            return response.data;
        });
    },
    getResourcesByCategory: function(category, query, options) {
        let q = query || "*";
        let url = "extjs/search/category/" + category + "/*" + q + "*/thumbnail"; // comma-separated list of wanted attributes
        return axios.get(url, this.addBaseUrl(parseOptions(options))).then(function(response) {return response.data; });
    },
    basicLogin: function(username, password, options) {
        let url = "users/user/details";
        return axios.get(url, this.addBaseUrl(_.merge({
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
    },
    changePassword: function(user, newPassword, options) {
        return axios.put(
            "users/user/" + user.id, "<User><newPassword>" + newPassword + "</newPassword></User>",
            this.addBaseUrl(_.merge({
                headers: {
                    'Content-Type': "application/xml"
                }
            }, options)));
    },
    addBaseUrl: function(options) {
        return assign(options, {baseURL: ConfigUtils.getDefaults().geoStoreUrl});
    },
    putResourceAttribute: function(resourceId, name, value, type, options) {
        return axios.put(
            "resources/resource/" + resourceId + "/attributes/" + name + "/" + value, null,
            this.addBaseUrl(_.merge({
                headers: {
                    'Content-Type': "application/xml"
                }
            }, options)));
    },
    putResourceMetadata: function(resourceId, newName, newDescription, options) {
        return axios.put(
            "resources/resource/" + resourceId,
            "<Resource><description>" + (newDescription || "") + "</description><metadata></metadata>" +
            "<name>" + (newName || "") + "</name></Resource>",
            this.addBaseUrl(_.merge({
                headers: {
                    'Content-Type': "application/xml"
                }
            }, options)));
    },
    putResource: function(resourceId, content, options) {
        return axios.put(
            "data/" + resourceId,
            content,
            this.addBaseUrl(_.merge({
                headers: {
                    'Content-Type': "application/json"
                }
            }, options)));
    },
    postPermissions: function(resourceId, canRead, canWrite, group, options) {
        return axios.post(
            "resources/resource/" + resourceId + "/permissions",
            "<SecurityRuleList><SecurityRule>" +
            "<canRead>" + (canRead || "") + "</canRead><canWrite>" + (canWrite || "") + "</canWrite>" +
            "<group><groupName>" + (group && group.groupName || "") + "</groupName><id>" + (group && group.id || "") + "</id></group>" +
            "</SecurityRule></SecurityRuleList>",
            this.addBaseUrl(_.merge({
                headers: {
                    'Content-Type': "application/xml"
                }
            }, options)));
    },
    postResource: function(name, data, category, options) {
        return axios.post(
            "resources/",
                "<Resource><description></description><metadata></metadata>" +
                "<name>" + (name || "") + "</name><category><name>" + (category || "") + "</name></category>" +
                "<store><data><![CDATA[" + (data || "") + "]]></data></store></Resource>",
            this.addBaseUrl(_.merge({
                headers: {
                    'Content-Type': "application/xml"
                }
            }, options)));
    },
    deleteResource: function(resourceId, options) {
        return axios.delete(
            "resources/resource/" + resourceId,
            this.addBaseUrl(_.merge({
            }, options)));
    }
};

module.exports = Api;
