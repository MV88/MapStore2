/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const layerTypes = {};


export const registerType = function(type, impl) {
    layerTypes[type] = impl;
};

export const createLayer = function(type, options) {
    var layerCreator = layerTypes[type];
    if (layerCreator && layerCreator.create) {
        return layerCreator.create(options);
    } else if (layerCreator) {
        // TODO this compatibility workaround should be removed
        // using the same interface
        return layerCreator(options);
    }
    return null;
};
export const renderLayer = function(type, options, map, mapId, layer) {
    var layerCreator = layerTypes[type];
    if (layerCreator && layerCreator.render) {
        return layerCreator.render(options, map, mapId, layer);
    }
    return null;
};
export const updateLayer = function(type, layer, newOptions, oldOptions) {
    var layerCreator = layerTypes[type];
    if (layerCreator && layerCreator.update) {
        return layerCreator.update(layer, newOptions, oldOptions);
    }
    return null;
};
export const isValid = function(type, layer) {
    var layerCreator = layerTypes[type];
    if (layerCreator && layerCreator.isValid) {
        return layerCreator.isValid(layer);
    }
    return true;
};
export const isSupported = function(type) {
    return !!layerTypes[type];
};

const Layers = {
    registerType,
    createLayer,
    renderLayer,
    updateLayer,
    isValid,
    isSupported
};

export default Layers;
