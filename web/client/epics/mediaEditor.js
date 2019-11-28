/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {Observable} from 'rxjs';
import uuid from 'uuid';
import {findKey} from 'lodash';

import {
    loadMedia,
    loadMediaSuccess,
    saveMediaSuccess,
    setAddingMedia,
    setEditingMedia,
    selectItem,
    updateItem,
    setMediaService,
    LOAD_MEDIA,
    SAVE_MEDIA,
    SHOW,
    ADDING_MEDIA,
    EDITING_MEDIA,
    IMPORT_IN_LOCAL
} from '../actions/mediaEditor';

import { HIDE, SAVE, hide as hideMapEditor, SHOW as MAP_EDITOR_SHOW} from '../actions/mapEditor';

import { editingSelector, sourceIdSelector, currentMediaTypeSelector, currentResourcesSelector, selectedItemSelector, sourcesSelector} from '../selectors/mediaEditor';
import {MediaTypes } from '../utils/GeoStoryUtils';
import {SourceTypes} from '../utils/MediaEditorUtils';

import mediaAPI from '../api/media';

export const loadMediaEditorDataEpic = (action$, store) =>
    // TODO: NOW IS TRIGGERED ON SHOW because we can not select the source and the media type yet.
    // final version should get mediaType and sourceId from settings, for show (ok for LOAD_MEDIA)
    // now we have only one type/source, so I trigger directly the load of it
    action$.ofType(SHOW, LOAD_MEDIA)
        .switchMap(() => {
            return mediaAPI("geostory").load(store) // store is required for local data (e.g. local geostory data)
                .switchMap(results =>
                    results && Observable.from(
                        results.map(r => loadMediaSuccess({
                            mediaType: r.mediaType,
                            sourceId: r.sourceId,
                            params: {mediaType: r.mediaType},
                            resultData: {resources: r.resources, totalCount: r.totalCount}
                        }))
                    ) || Observable.empty()
                );
        });

/**
 * Handles save|updates media events:
 * - API callback
 * - Success action emission
 * - close add form
 * - reload data of the updated source
 * @memberof epics.mediaEditor
 * @param {Observable} action$ stream of actions
 * @param {object} store redux store
 */
export const editorSaveUpdateMediaEpic = (action$, store) =>
    action$.ofType(SAVE_MEDIA)
        .switchMap(({mediaType = "image", source, data}) => {
            const editing = editingSelector(store.getState());
            const sourceId = sourceIdSelector(store.getState());
            const handler = editing ?
                mediaAPI(sourceId).edit(mediaType, source, data, store) :
                mediaAPI(sourceId).save(mediaType, source, data, store);
            const feedbackAction = editing ? setEditingMedia(false) : setAddingMedia(false);
            return handler // store is required both for some custom auth, or to dispatch actions in case of local
                // TODO: saving state (for loading spinners), errors
                .switchMap(({id}) => {
                    return Observable.of(
                        saveMediaSuccess({mediaType, source, data, id}),
                        feedbackAction,
                        selectItem(id)
                    );
                });
        });
/**
 * Handles new map creation
 * On map save:
 * Store created map in geostory
 * select it
 * hide mapEditor
 * On cancel:
 * Stops adding media
 * @memberof epics.mediaEditor
 * @param {Observable} action$ stream of actions
 * @param {object} store redux store
 */
export const mediaEditorNewMap = (action$, {getState} ) =>
    action$.ofType(MAP_EDITOR_SHOW)
        .filter(({owner, map}) => owner === 'mediaEditor' && !map)
        .switchMap(() => {
            const switchToEditStream = action$.ofType(SAVE).switchMap(({map}) => {
                const currentResources = currentResourcesSelector(getState()) || [];
                const resId = uuid();
                return Observable.from([loadMediaSuccess({
                    mediaType: MediaTypes.MAP,
                    sourceId: SourceTypes.GEOSTORY,
                    params: {mediaType: MediaTypes.MAP},
                    resultData: {resources: [{ id: resId, type: 'map', data: {type: 'map', id: resId, ...map}}, ...currentResources], totalCount: currentResources.length + 1}}),
                selectItem(resId),
                hideMapEditor()]);
            }).takeUntil(action$.ofType(HIDE));
            const cancelStream = action$.ofType(HIDE).map(() => setAddingMedia(false)).takeUntil(action$.ofType(SAVE));
            return Observable.merge(cancelStream, switchToEditStream);
        });
/**
* Handles map editing
* On map save:
* update current selected item
* hide mapEditor
* On cancel:
* Stops adding media
* @memberof epics.mediaEditor
* @param {Observable} action$ stream of actions
* @param {object} store redux store
*/
export const mediaEditorEditMap = (action$, {getState}) =>
    action$.ofType(MAP_EDITOR_SHOW)
        .filter(({owner, map}) => owner === 'mediaEditor' && !!map)
        .switchMap(() => action$.ofType(SAVE)
            .switchMap(({map: editedMap}) => {
                const selectedItems = selectedItemSelector(getState());
                return Observable.from([updateItem({...selectedItems, data: {...editedMap}}), hideMapEditor()]);
            })
            .takeUntil(action$.ofType(HIDE))
        );

/**
 * Reload local geostory media on close editing or adding media
 * @memberof epics.mediaEditor
 * @param {Observable} action$ stream of actions
 * @param {object} store redux store
 */
export const reloadMediaResources = (action$, {getState}) =>
    action$.ofType(EDITING_MEDIA, ADDING_MEDIA)
        .filter(({editing = true, adding = true}) => editing === false || adding === false)
        .map(() => loadMedia(undefined, currentMediaTypeSelector(getState()), SourceTypes.GEOSTORY));

/**
 * Handle the import of a resource from en external source to local source
 * @memberof epics.mediaEditor
 * @param {Observable} action$ stream of actions
 * @param {object} store redux store
 */

export const importInLocalSource = (action$, store) =>
    action$.ofType(IMPORT_IN_LOCAL)
        .switchMap(({resource, sourceType}) => {
            const sources = sourcesSelector(store.getState());
            const sourceId = findKey(sources, ({type}) => sourceType === type);
            const handler = mediaAPI(sourceId).save(resource.type, sources[sourceId], resource, store);
            return handler // store is required both for some custom auth, or to dispatch actions in case of local
                // TODO: saving state (for loading spinners), errors
                .switchMap(({id}) => {
                    return Observable.of(
                        setMediaService(sourceId),
                        saveMediaSuccess({mediaType: resource.type, source: sources[sourceId], data: resource, id}),
                        loadMedia(undefined, resource.type, sources[sourceId]),
                        selectItem(id)
                    );
                });
        });
