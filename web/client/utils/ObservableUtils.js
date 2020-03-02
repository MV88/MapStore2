/*
* Copyright 2019, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import Rx from 'rxjs';
import { get } from 'lodash';
import { parseString } from 'xml2js';
import { stripPrefix } from 'xml2js/lib/processors';
import GeoStoreApi from '../api/GeoStoreDAO';
import { updatePermissions, updateAttribute, doNothing } from '../actions/maps';
import ConfigUtils from '../utils/ConfigUtils';
import { basicSuccess, basicError } from '../utils/NotificationUtils';

class OGCError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'OGCError';
        this.code = code;
    }
}
export const parseXML = (xml, options = {
    tagNameProcessors: [stripPrefix],
    explicitArray: false,
    mergeAttrs: true
} ) => Rx.Observable.bindNodeCallback((data, callback) => parseString(data, options, callback))(xml);
/**
 * Intercept OGC Exception (200 response with exceptionReport) to throw error in the stream
 * @param  {observable} observable The observable that emits the server response
 * @return {observable}            The observable that returns the response or throws the error.
 */
export const interceptOGCError = (observable) => observable.switchMap(response => {
    if (typeof response.data === "string") {
        if (response.data.indexOf("ExceptionReport") > 0) {
            return Rx.Observable.bindNodeCallback( (data, callback) => parseString(data, {
                tagNameProcessors: [stripPrefix],
                explicitArray: false,
                mergeAttrs: true
            }, callback))(response.data).map(data => {
                const message = get(data, "ExceptionReport.Exception.ExceptionText");
                throw new OGCError(message || "Undefined OGC Service Error", get(data, "ExceptionReport.Exception.exceptionCode"));
            });

        }
    }
    return Rx.Observable.of(response);
});

export const createAssociatedResource = ({attribute, permissions, mapId, metadata, value, category, type, optionsRes, optionsAttr} = {}) => {
    return Rx.Observable.fromPromise(
        GeoStoreApi.createResource(metadata, value, category, optionsRes)
            .then(res => res.data))
        .switchMap((resourceId) => {
            // update permissions
            let actions = [];
            actions.push(updatePermissions(resourceId, permissions));
            const attributeUri = ConfigUtils.getDefaults().geoStoreUrl + "data/" + resourceId + "/raw?decode=datauri";
            // UPDATE resource map with new attribute
            actions.push(updateAttribute(mapId, attribute, attributeUri, type, optionsAttr));
            // display a success message
            actions.push(basicSuccess({message: "maps.feedback." + attribute + ".savedSuccesfully" }));
            return Rx.Observable.from(actions);
        })
        .catch(() => Rx.Observable.of(basicError({message: "maps.feedback.errorWhenSaving"})));
};

export const updateAssociatedResource = ({permissions, resourceId, value, attribute, options} = {}) => {
    return Rx.Observable.fromPromise(GeoStoreApi.putResource(resourceId, value, options)
        .then(res => res.data))
        .switchMap((id) => {
            let actions = [];
            actions.push(basicSuccess({ message: "maps.feedback." + attribute + ".updatedSuccesfully"}));
            actions.push(updatePermissions(id, permissions));
            return Rx.Observable.from(actions);
        })
        .catch(() => Rx.Observable.of(basicError({message: "maps.feedback.errorWhenUpdating"})));
};
export const deleteAssociatedResource = ({mapId, attribute, type, resourceId, options} = {}) => {
    return Rx.Observable.fromPromise(GeoStoreApi.deleteResource(resourceId, options)
        .then(res => res.status === 204))
        .switchMap((deleted) => {
            let actions = [];
            if (deleted) {
                actions.push(basicSuccess({ message: "maps.feedback." + attribute + ".deletedSuccesfully" }));
                actions.push(updateAttribute(mapId, attribute, "NODATA", type, options));
                return Rx.Observable.from(actions);
            }
            actions.push(doNothing());
            return Rx.Observable.from(actions);
        })
        .catch(() => Rx.Observable.of(basicError({message: "maps.feedback.errorWhenDeleting"})));
};

export const deleteResourceById = (resId, options) => resId ?
    GeoStoreApi.deleteResource(resId, options)
        .then((res) => {return {data: res.data, resType: "success", error: null}; })
        .catch((e) => {return {error: e, resType: "error"}; }) :
    Rx.Observable.of({resType: "success"});
