/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var GeoStoreApi = require('../api/GeoStoreDAO');
const ConfigUtils = require('../utils/ConfigUtils');

const MAPS_LIST_LOADED = 'MAPS_LIST_LOADED';
const MAPS_LIST_LOADING = 'MAPS_LIST_LOADING';
const MAPS_LIST_LOAD_ERROR = 'MAPS_LIST_LOAD_ERROR';
const MAP_UPDATED = 'MAP_UPDATED';
const MAP_CREATED = 'MAP_CREATED';
const MAP_DELETED = 'MAP_DELETED';
const MAP_SAVED = 'MAP_SAVED';
const THUMBNAIL_UPDATED = 'THUMBNAIL_UPDATED';
const THUMBNAIL_DELETED = 'THUMBNAIL_DELETED';

function mapsLoading(searchText, params) {
    return {
        type: MAPS_LIST_LOADING,
        searchText,
        params
    };
}

function mapsLoaded(maps, params, searchText) {
    return {
        type: MAPS_LIST_LOADED,
        params,
        maps,
        searchText
    };
}

function loadError(e) {
    return {
        type: MAPS_LIST_LOAD_ERROR,
        error: e
    };
}

function mapUpdated(resourceId, newName, newDescription, result, error) {
    return {
        type: MAP_UPDATED,
        resourceId,
        newName,
        newDescription,
        result,
        error
    };
}

function mapDeleted(resourceId, result, error) {
    return {
        type: MAP_DELETED,
        resourceId,
        result,
        error
    };
}

function thumbnailDeleted(resourceId, result, error) {
    return {
        type: THUMBNAIL_DELETED,
        resourceId,
        result,
        error
    };
}

function thumbnailUpdated(resourceId, newThumbnailUrl, thumbnailId, result, error) {
    return {
        type: THUMBNAIL_UPDATED,
        resourceId,
        newThumbnailUrl: newThumbnailUrl,
        thumbnailId: thumbnailId,
        result,
        error
    };
}

function loadMaps(geoStoreUrl, searchText="*", params={start: 0, limit: 20}) {
    return (dispatch) => {
        let opts = {params, baseURL: geoStoreUrl };
        dispatch(mapsLoading(searchText, params));
        GeoStoreApi.getResourcesByCategory("MAP", searchText, opts).then((response) => {
            dispatch(mapsLoaded(response, params, searchText));
        }).catch((e) => {
            dispatch(loadError(e));
        });
    };
}

function updateMap(resourceId, content, options) {
    return (dispatch) => {
        GeoStoreApi.putResource(resourceId, content, options).then(() => {
            dispatch(mapUpdated(resourceId, content, "success"));
        }).catch((e) => {
            dispatch(loadError(e));
        });
    };
}

function updatePermissions(resourceId, canRead, canWrite, group, options) {
    return () => {
        GeoStoreApi.postPermissions(resourceId, canRead, canWrite, group, options);
    };
}

function updateAttribute(resourceId, thumbnailId, name, value, type, options) {
    return (dispatch) => {
        GeoStoreApi.putResourceAttribute(resourceId, name, value, type, options).then(() => {
            dispatch(thumbnailUpdated(resourceId, value, thumbnailId, "success"));
        }).catch((e) => {
            dispatch(thumbnailUpdated(resourceId, value, thumbnailId, "failure", e));
        });
    };
}

function createThumbnail(nameThumbnail, dataThumbnail, categoryThumbnail, resourceIdMap, options) {
    return (dispatch) => {
        GeoStoreApi.postResource(nameThumbnail, dataThumbnail, categoryThumbnail, options).then((response) => {
            const group = {
                groupName: "everyone",
                id: 3
            };
            dispatch(updatePermissions(response.data, true, false, group, options)); // UPDATE resource permissions
            const thumbnailUrl = ConfigUtils.getDefaults().geoStoreUrl + "data/" + response.data + "/raw?decode=datauri";
            const encodedThumbnailUrl = encodeURIComponent(encodeURIComponent(thumbnailUrl));
            dispatch(updateAttribute(resourceIdMap, response.data, "thumbnail", encodedThumbnailUrl, "STRING", options)); // UPDATE resource map with new attribute
        });
    };
}

// TODO check why it returns and a failure essage
function deleteThumbnail(resourceId, options) {
    return (dispatch) => {
        GeoStoreApi.deleteResource(resourceId, options).then(() => {
            dispatch(thumbnailDeleted(resourceId, "success"));
        }).catch((e) => {
            dispatch(thumbnailDeleted(resourceId, "failure", e));
        });
    };
}

function updateMapMetadata(resourceId, newName, newDescription, options) {
    return (dispatch) => {
        GeoStoreApi.putResourceMetadata(resourceId, newName, newDescription, options).then(() => {
            dispatch(mapUpdated(resourceId, newName, newDescription, "success"));
        }).catch((e) => {
            dispatch(mapUpdated(resourceId, newName, newDescription, "failure", e));
        });
    };
}

function deleteMap(resourceId, options) {
    return (dispatch) => {
        GeoStoreApi.deleteResource(resourceId, options).then(() => {
            dispatch(mapDeleted(resourceId, "success"));
        }).catch((e) => {
            dispatch(mapDeleted(resourceId, "failure", e));
        });
    };
}

module.exports = {MAPS_LIST_LOADED, MAPS_LIST_LOADING, MAPS_LIST_LOAD_ERROR, MAP_CREATED, MAP_UPDATED, MAP_DELETED, MAP_SAVED, THUMBNAIL_UPDATED, THUMBNAIL_DELETED, loadMaps, updateMap, updateMapMetadata, deleteMap, deleteThumbnail, createThumbnail};
