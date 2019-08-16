/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {Observable} from 'rxjs';
import { SHOW, SAVE_MEDIA, setAddingMedia, saveMediaSuccess, LOAD_MEDIA, loadMedia, loadMediaSuccess } from '../actions/mediaEditor';
import mediaAPI from '../api/media';

export const loadMediaEditorData = (action$, store) =>
    // TODO: NOW IS TRIGGERED ON SHOW because we can not select the source and the media type yet.
    // final version should get mediaType and sourceId from settings, for show (ok for LOAD_MEDIA)
    // now we have only one type/source, so I trigger directly the load of it
    action$.ofType(SHOW, LOAD_MEDIA).switchMap(({
        mediaType = 'image',
        sourceId = "geostory"
    }) => {
        const params = {}; // TODO: get params from state or action
        // TODO: get media type and source
        return mediaAPI(mediaType, /* TODO: get the source from the sourceId */)
            .load(params, store) // store is required for local data (e.g. local geostory data)
            .switchMap(resultData =>
                Observable.of(loadMediaSuccess(mediaType, sourceId, params, resultData))
            );

    });

/**
 * Handles save new media events:
 * - API callback
 * - Success action emission
 * - close add form
 * - reload data of the updated source
 * @memberof epics.mediaEditor
 * @param {Observable} action$ stream of actions
 * @param {object} store redux store
 */
export const editorSaveNewMedia = (action$, store) =>
    action$.ofType(SAVE_MEDIA)
    .switchMap(({mediaType, source, data}) =>
        mediaAPI(mediaType, source)
            .save(mediaType, source, data, store) // store is required both for some custom auth, or to dispatch actions in case of local
            // TODO: saving state (for loading spinners), errors
            .switchMap(id =>
                Observable.of(
                    saveMediaSuccess({mediaType, source, data, id}),
                    setAddingMedia(false),
                    loadMedia(mediaType, source)
                )
            )
    );
