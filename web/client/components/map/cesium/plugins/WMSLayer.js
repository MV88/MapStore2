/*
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Layers = require('../../../../utils/cesium/Layers');
const ConfigUtils = require('../../../../utils/ConfigUtils');
const ProxyUtils = require('../../../../utils/ProxyUtils');
const Cesium = require('../../../../libs/cesium');
const assign = require('object-assign');
const {isArray} = require('lodash');

function getWMSURLs( urls ) {
    return urls.map((url) => url.split("\?")[0]);
}


function splitUrl(originalUrl) {
    let url = originalUrl;
    let queryString = "";
    if (originalUrl.indexOf('?') !== -1) {
        url = originalUrl.substring(0, originalUrl.indexOf('?') + 1);
        if (originalUrl.indexOf('%') !== -1) {
            url = decodeURIComponent(url);
        }
        queryString = originalUrl.substring(originalUrl.indexOf('?') + 1);
    }
    return {url, queryString};
}

function WMSProxy(proxy) {
    this.proxy = proxy;
}

WMSProxy.prototype.getURL = function(resource) {
    let {url, queryString} = splitUrl(resource);
    return this.proxy.url + encodeURIComponent(url + queryString);
};

function NoProxy() {
}

NoProxy.prototype.getURL = function(resource) {
    let {url, queryString} = splitUrl(resource);
    return url + queryString;
};

function getQueryString(parameters) {
    return Object.keys(parameters).map((key) => key + '=' + encodeURIComponent(parameters[key])).join('&');
}

function wmsToCesiumOptionsSingleTile(options) {
    const opacity = options.opacity !== undefined ? options.opacity : 1;
    const parameters = assign({
        styles: options.style || "",
        format: options.format || 'image/png',
        transparent: options.transparent !== undefined ? options.transparent : true,
        opacity: opacity,
        tiled: options.tiled !== undefined ? options.tiled : true,
        layers: options.name,
        width: options.size || 2000,
        height: options.size || 2000,
        bbox: "-180.0,-90,180.0,90",
        srs: "EPSG:4326"
    }, options.params || {});

    return {
        url: (isArray(options.url) ? options.url[Math.round(Math.random() * (options.url.length - 1))] : options.url) + '?service=WMS&version=1.1.0&request=GetMap&' + getQueryString(parameters)
    };
}

function wmsToCesiumOptions(options) {
    var opacity = options.opacity !== undefined ? options.opacity : 1;
    let proxyUrl = ConfigUtils.getProxyUrl({});
    let proxy;
    if (proxyUrl) {
        proxy = ProxyUtils.needProxy(options.url) && proxyUrl;
    }
    // NOTE: can we use opacity to manage visibility?
    return assign({
        url: "{s}",
        subdomains: getWMSURLs(isArray(options.url) ? options.url : [options.url]),
        proxy: proxy && new WMSProxy(proxy) || new NoProxy(),
        layers: options.name,
        enablePickFeatures: false,
        parameters: assign({
            styles: options.style || "",
            format: options.format || 'image/png',
            transparent: options.transparent !== undefined ? options.transparent : true,
            opacity: opacity
        }, options.params || {})
    });
}

const createLayer = (options) => {
    let layer;
    if (options.singleTile) {
        layer = new Cesium.SingleTileImageryProvider(wmsToCesiumOptionsSingleTile(options));
    } else {
        layer = new Cesium.WebMapServiceImageryProvider(wmsToCesiumOptions(options));
    }

    layer.updateParams = (params) => {
        const newOptions = assign({}, options, {
            params: assign({}, options.params || {}, params)
        });
        return createLayer(newOptions);
    };
    return layer;
};
const updateLayer = (newOptions, oldOptions) => {
    if (oldOptions.singleTile !== newOptions.singleTile || oldOptions.tiled !== newOptions.tiled) {
        let layer;
        if (newOptions.singleTile) {
            layer = new Cesium.SingleTileImageryProvider(wmsToCesiumOptionsSingleTile(newOptions));
        } else {
            layer = new Cesium.WebMapServiceImageryProvider(wmsToCesiumOptions(newOptions));
        }
        layer.updateParams = (params) => {
            const newOp = assign({}, newOptions, {
                params: assign({}, newOptions.params || {}, params)
            });
            return createLayer(newOp);
        };
        return layer;
    }
    return null;
};
Layers.registerType('wms', {create: createLayer, update: updateLayer});
