/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import axios from '../libs/ajax';

export const MAP_CONFIG_LOADED = 'MAP_CONFIG_LOADED';
export const MAP_CONFIG_LOAD_ERROR = 'MAP_CONFIG_LOAD_ERROR';
export const MAP_INFO_LOAD_START = 'MAP_INFO_LOAD_START';
export const MAP_INFO_LOADED = 'MAP_INFO_LOADED';
export const MAP_INFO_LOAD_ERROR = 'MAP_INFO_LOAD_ERROR';

export function configureMap(conf, mapId) {
    return {
        type: MAP_CONFIG_LOADED,
        config: conf,
        legacy: !!mapId,
        mapId: mapId
    };
}

export function configureError(e, mapId) {
    return {
        type: MAP_CONFIG_LOAD_ERROR,
        error: e,
        mapId
    };
}

export function loadMapConfig(configName, mapId) {
    return (dispatch) => {
        return axios.get(configName).then((response) => {
            if (typeof response.data === 'object') {
                dispatch(configureMap(response.data, mapId));
            } else {
                try {
                    JSON.parse(response.data);
                } catch (e) {
                    dispatch(configureError('Configuration file broken (' + configName + '): ' + e.message, mapId));
                }
            }
        }).catch((e) => {
            dispatch(configureError(e, mapId));
        });
    };
}
export function mapInfoLoaded(info, mapId) {
    return {
        type: MAP_INFO_LOADED,
        mapId,
        info
    };
}
export function mapInfoLoadError(mapId, error) {
    return {
        type: MAP_INFO_LOAD_ERROR,
        mapId,
        error
    };
}
export function mapInfoLoadStart(mapId) {
    return {
        type: MAP_INFO_LOAD_START,
        mapId
    };
}
export function loadMapInfo(url, mapId) {
    return (dispatch) => {
        dispatch(mapInfoLoadStart(mapId));
        return axios.get(url).then((response) => {
            if (typeof response.data === 'object') {
                if (response.data.ShortResource) {
                    dispatch(mapInfoLoaded(response.data.ShortResource, mapId));
                } else {
                    dispatch(mapInfoLoaded(response.data, mapId));
                }

            } else {
                try {
                    JSON.parse(response.data);
                } catch (e) {
                    dispatch(mapInfoLoadError( mapId, e));
                }
            }
        }).catch((e) => {
            dispatch(mapInfoLoadError(mapId, e));
        });
    };

}
