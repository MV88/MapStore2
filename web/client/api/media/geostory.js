/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Observable } from 'rxjs';
import uuid from 'uuid';

import { addResource } from '../../actions/geostory';
import { resourcesSelector } from '../../selectors/geostory';


/**
 * API to save in local resources. The method must all implement the same interface.
 * TODO: bring the interface documentation into mediaAPI
 */
export default {
    /**
     * Saves a media with passed data and returns the object shaped as {id, mediaType, data, source}
     * @param {string} mediaType type of the media (image, video...)
     * @param {object} source source object
     * @param {object} data the effective media data
     * @param {object} store redux store middleware object (with dispatch and getStore method)
     * @returns {Observable} a stream that emit an object like this
     * ```
     * {
     *   id, // generated by the service
     *   mediaType, // original media type
     *   data, // effective media object data
     *   source // source object
     * }
     * ```
     */
    save: (mediaType, source, data, store) =>
        Observable.of(uuid()).do(
            (id) => store.dispatch(addResource(id, mediaType, data))
        ).map( id => ({id, mediaType, data, source})),
    /**
     * load data from the source, with the search parameters passed
     * @returns {Observable} a stream that emits an object with the following shape:
     * ```json
     * {
     *     resources: [{id, type, data}],
     *     totalCount: 1
     * }
     * ```
     */
    load: ({mediaType}, store) => {
        const resources = resourcesSelector(store.getState())
            .filter(({ type }) => type === mediaType);
        return Observable.of({
            resources,
            totalCount: resources.length
        });
    }
};
