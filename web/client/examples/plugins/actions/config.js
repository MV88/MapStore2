/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
export const SAVE_PLUGIN_CONFIG = 'SAVE_PLUGIN_CONFIG';
export const COMPILE_ERROR = 'COMPILE_ERROR';

export function savePluginConfig(plugin, cfg) {
    return {
        type: SAVE_PLUGIN_CONFIG,
        plugin,
        cfg
    };
}

export function compileError(message) {
    return {
        type: COMPILE_ERROR,
        message
    };
}

export function resetError() {
    return {
        type: COMPILE_ERROR,
        message: null
    };
}
