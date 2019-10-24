/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const EDIT_MAP = 'EDIT_MAP';
export const UPDATE_CURRENT_MAP = 'UPDATE_CURRENT_MAP';
export const UPDATE_CURRENT_MAP_PERMISSIONS = 'UPDATE_CURRENT_MAP_PERMISSIONS';
export const UPDATE_CURRENT_MAP_GROUPS = 'UPDATE_CURRENT_MAP_GROUPS';
export const ERROR_CURRENT_MAP = 'ERROR_CURRENT_MAP';
export const REMOVE_THUMBNAIL = 'REMOVE_THUMBNAIL';
export const RESET_CURRENT_MAP = 'RESET_CURRENT_MAP';
export const ADD_CURRENT_MAP_PERMISSION = 'ADD_CURRENT_MAP_PERMISSION';

export function editMap(map, openModalProperties) {
    return {
        type: EDIT_MAP,
        map,
        openModalProperties
    };
}

// update the thumbnail and the thumbnailData property of the currentMap
export function updateCurrentMap(thumbnailData, thumbnail) {
    return {
        type: UPDATE_CURRENT_MAP,
        thumbnail,
        thumbnailData
    };
}

export function updateCurrentMapPermissions(permissions) {
    return {
        type: UPDATE_CURRENT_MAP_PERMISSIONS,
        permissions
    };
}

export function updateCurrentMapGroups(groups) {
    return {
        type: UPDATE_CURRENT_MAP_GROUPS,
        groups
    };
}

export function errorCurrentMap(errors, resourceId) {
    return {
        type: ERROR_CURRENT_MAP,
        errors,
        resourceId
    };
}

export function removeThumbnail(resourceId) {
    return {
        type: REMOVE_THUMBNAIL,
        resourceId
    };
}

/**
 * reset current map , `RESET_CURRENT_MAP`
 * @memberof actions.maps
 * @return {action} of type `RESET_CURRENT_MAP`
 */
export function resetCurrentMap() {
    return {
        type: RESET_CURRENT_MAP
    };
}

export function addCurrentMapPermission(rule) {
    return {
        type: ADD_CURRENT_MAP_PERMISSION,
        rule
    };
}

