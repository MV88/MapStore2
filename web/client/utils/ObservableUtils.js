const Rx = require('rxjs');
const {get, isNil} = require('lodash');
const {parseString} = require('xml2js');
const {stripPrefix} = require('xml2js/lib/processors');
const GeoStoreApi = require('../api/GeoStoreDAO');
const {updatePermissions, updateAttribute, doNothing} = require('../actions/maps');
const ConfigUtils = require('../utils/ConfigUtils');
const LocaleUtils = require('../utils/LocaleUtils');
const {basicSuccess, basicError} = require('../utils/NotificationUtils');

class OGCError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'OGCError';
        this.code = code;
    }
}
/**
 * Intercept OGC Exception (200 response with exceptionReport) to throw error in the stream
 * @param  {observable} observable The observable that emits the server response
 * @return {observable}            The observable that returns the response or throws the error.
 */
const interceptOGCError = (observable) => observable.switchMap(response => {
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

const getIdFromUri = (uri) => {
    const decodedUri = decodeURIComponent(uri);
    return /\d+/.test(decodedUri) ? decodedUri.match(/\d+/)[0] : null;
};
const createAssociatedResource = ({attribute, permissions, mapId, metadata, value, category, type, optionsRes, optionsAttr, messages} = {}) => {
    return Rx.Observable.fromPromise(
            GeoStoreApi.createResource(metadata, value, category, optionsRes)
            .then(res => res.data))
            .switchMap((resourceId) => {
                // update permissions
                let actions = [];
                actions.push(updatePermissions(resourceId, permissions));
                const attibuteUri = ConfigUtils.getDefaults().geoStoreUrl + "data/" + resourceId + "/raw?decode=datauri";
                const encodedResourceUri = encodeURIComponent(encodeURIComponent(attibuteUri));
                // UPDATE resource map with new attribute
                actions.push(updateAttribute(mapId, attribute, encodedResourceUri, type, optionsAttr));
                // display a success message
                actions.push(basicSuccess({message: LocaleUtils.getMessageById(messages, "maps.feedback." + attribute + ".savedSuccesfully" ) }));
                return Rx.Observable.from(actions);
            })
        .catch(() => Rx.Observable.of(basicError({message: "maps.feedback.errorWhenSaving"})));
};

const updateAssociatedResource = ({permissions, resourceId, value, attribute, options, messages} = {}) => {
    return Rx.Observable.fromPromise(GeoStoreApi.putResource(resourceId, value, options)
            .then(res => res.data))
            .switchMap((id) => {
                let actions = [];
                actions.push(basicSuccess({ message: LocaleUtils.getMessageById(messages, "maps.feedback." + attribute + ".updatedSuccesfully" )}));
                actions.push(updatePermissions(id, permissions));
                return Rx.Observable.from(actions);
            })
        .catch(() => Rx.Observable.of(basicError({message: "maps.feedback.errorWhenUpdating"})));
};
const deleteAssociatedResource = ({mapId, attribute, type, resourceId, options, messages} = {}) => {
    return Rx.Observable.fromPromise(GeoStoreApi.deleteResource(resourceId, options)
            .then(res => res.status === 204))
            .switchMap((deleted) => {
                let actions = [];
                if (deleted) {
                    actions.push(basicSuccess({ message: LocaleUtils.getMessageById(messages, "maps.feedback." + attribute + ".deletedSuccesfully" ) }));
                    actions.push(updateAttribute(mapId, attribute, "NODATA", type, options));
                    return Rx.Observable.from(actions);
                }
                actions.push(doNothing());
                return Rx.Observable.from(actions);
            })
        .catch(() => Rx.Observable.of(basicError({message: "maps.feedback.errorWhenDeleting"})));
};

const deleteResourceById = (resId, options) => resId ?
    GeoStoreApi.deleteResource(resId, options)
        .then((res) => {return {data: res.data, resType: "success", error: null}; })
        .catch((e) => {return {error: e, resType: "error"}; }) :
    Rx.Observable.of({resType: "success"});

const manageMapResource = ({map = {}, attribute = "", resource = null, type = "STRING", optionsDel = {}, messages = {}} = {}) => {
    const attrVal = map[attribute];
    const mapId = map.id;
    // create
    if ((isNil(attrVal) || attrVal === "NODATA") && !isNil(resource)) {
        return createAssociatedResource({...resource, attribute, mapId, type, messages});
    }
    if (isNil(resource)) {
        // delete
        return deleteAssociatedResource({
            mapId,
            attribute,
            type,
            resourceId: getIdFromUri(attrVal),
            options: optionsDel,
            messages});
    }
    // update
    return updateAssociatedResource({
        permissions: resource.permissions,
        resourceId: getIdFromUri(attrVal),
        value: resource.value,
        attribute,
        options: resource.optionsAttr,
        messages});

};

module.exports = {
    getIdFromUri,
    deleteResourceById,
    createAssociatedResource,
    updateAssociatedResource,
    deleteAssociatedResource,
    interceptOGCError,
    manageMapResource
};
