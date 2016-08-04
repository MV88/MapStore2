/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {MAPS_LIST_LOADED, MAPS_LIST_LOADING, MAPS_LIST_LOAD_ERROR, THUMBNAIL_UPDATED, MAP_UPDATED, MAP_DELETED, THUMBNAIL_DELETED} = require('../actions/maps');
const assign = require('object-assign');
function maps(state = null, action) {
    switch (action.type) {
        case MAPS_LIST_LOADING:
            return assign({}, state, {
                loading: true,
                start: action.params && action.params.start,
                limit: action.params && action.params.limit,
                searchText: action.searchText
            });
        case MAPS_LIST_LOADED:
            if (action.maps && action.maps.results && Array.isArray(action.maps.results)) {
                return assign({}, action.maps, {
                    loading: false,
                    start: action.params && action.params.start,
                    limit: action.params && action.params.limit,
                    searchText: action.searchText
                });
            }
            let results = action.maps.results !== "" ? [action.maps.results] : [];
            return assign({}, state, action.maps, {results, loading: false});
        case MAPS_LIST_LOAD_ERROR:
            return {
                loadingError: action.error
            };
        case MAP_UPDATED: {
            let newMaps = (state.results === "" ? [] : [...state.results] );

            for (let i = 0; i < newMaps.length; i++) {
                if (newMaps[i].id && newMaps[i].id === action.resourceId) {
                    newMaps[i] = assign({}, newMaps[i], {description: action.newDescription, name: action.newName});
                }
            }
            return assign({}, state, {results: newMaps});
        }
        case THUMBNAIL_UPDATED: {
            let newMaps = (state.results === "" ? [] : [...state.results] );

            for (let i = 0; i < newMaps.length; i++) {
                if (newMaps[i].id && newMaps[i].id === action.resourceId) {
                    newMaps[i] = assign({}, newMaps[i], {thumbnail: decodeURIComponent(action.newThumbnailUrl), thumbnailId: action.thumbnailId});
                }
            }
            return assign({}, state, {results: newMaps});
        }
        case MAP_DELETED: {
            let newMaps = (state.results === "" ? [] : [...state.results] );
            return assign({}, state, {results: newMaps.filter(function(el) {
                return el.id && el.id !== action.resourceId;
            })});
        }
        case THUMBNAIL_DELETED: {
            let newMaps = (state.results === "" ? [] : [...state.results] );
            return assign({}, state, {results: newMaps.filter(function(el) {
                return el.id && el.id !== action.resourceId;
            })});
        }
        default:
            return state;
    }
}

module.exports = maps;
