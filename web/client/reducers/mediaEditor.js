/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { set, compose } from '../utils/ImmutableUtils';
import { SHOW, HIDE, CHOOSE_MEDIA, ADDING_MEDIA, LOAD_MEDIA_SUCCESS, SELECT_ITEM} from '../actions/mediaEditor';

const DEFAULT_STATE = {
    open: false,
    // contains local data (path for data is mediaType, sourceId, e.g. data: {image : { geostory: { resultData: {...}, params: {...}}})
    data: {},
    settings: {
        mediaType: 'image', // current selected media type
        sourceId: 'geostory', // current selected service
        // available media types
        mediaTypes: {
            image: {
                sources: ['geostory'] // services for the selected media type
            }
        },
        // all media sources available, with their type
        sources: {
            geostory: {
                type: 'geostory'
            }
        }
    }
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SHOW:
            // setup media editor settings
            return compose(
                    set('open', true),
                    set('owner', action.owner),
                    // set('settings', action.settings || state.settings), // TODO: allow fine customization
                    // set('stashedSettings', state.settings) // This should allow to use default config or customize for a different usage
                )(state);
        case HIDE:
            // hide resets the media editor as well as selected
        case CHOOSE_MEDIA:
            // resets all media editor settings
            return compose(
                set('open', false),
                set('owner', undefined),
                set('settings', state.stashedSettings || state.settings), // restore defaults
                set('stashedSettings', undefined)
            )(state);
        // set adding media state (to toggle add/select in media selectors)
        case ADDING_MEDIA: {
            return set('saveState.addingMedia', action.adding, state);
        }
        case LOAD_MEDIA_SUCCESS: {
            const {resultData, params, mediaType, sourceId} = action;
            return set(`data["${mediaType}"]["${sourceId}"]`, { params, resultData }, state);
        }
        case SELECT_ITEM: {
            return set('selected', action.id, state);
        }
        default:
            return state;
    }
};
