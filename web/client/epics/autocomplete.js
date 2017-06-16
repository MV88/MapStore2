/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Rx = require('rxjs');
const axios = require('../libs/ajax');
const {UPDATE_FILTER_FIELD, updateFilterFieldOptions, loadingFilterFieldOptions, setAutocompleteMode} = require('../actions/queryform');
const {TOGGLE_CONTROL} = require('../actions/controls');
const {getRequestBody, getRequestBodyWithFilter} = require('../utils/ogc/WPS/autocomplete');
// const assign = require('object-assign');
const {isArray, startsWith} = require('lodash');
const {error} = require('../actions/notifications');


// create wps request
function getWpsPayload(options) {
    return options.value ? getRequestBodyWithFilter(options) : getRequestBody(options);
}
 /**
  * Epics for WFS query requests
  * @name epics.wfsquery
  * @type {Object}
  */

module.exports = {

    isAutoCompleteEnabled: (action$, store) =>
    action$.ofType(TOGGLE_CONTROL)
        .filter((action) => action.control === "queryPanel" && store.getState().controls.queryPanel.enabled && !store.getState().queryform.autocompleteEnabled)
        .switchMap(() => {
            return Rx.Observable.fromPromise(
                axios.post("geoserver-test/wps?SERVICE=WPS&VERSION=1.0.0&REQUEST=DescribeProcess&IDENTIFIER=gs%3APagedUnique", null, {
                    timeout: 60000,
                    headers: {'Accept': 'application/json', 'Content-Type': 'application/xml'}
                }).then(res => res.data)
            ).switchMap((data) => {
                if (startsWith(data, "<ows:ExceptionReport")) {
                    return Rx.Observable.of(setAutocompleteMode(false));
                }
                return Rx.Observable.of(setAutocompleteMode(true));
            }).catch((e) => {console.log(e); });
        }),
    fetchAutocompleteOptionsEpic: (action$, store) =>
        action$.ofType(UPDATE_FILTER_FIELD)
            .filter( (action) => action.fieldName === "value" && action.fieldType === "string" && store.getState().queryform.autocompleteEnabled )
            .debounceTime(300)
            .switchMap((action) => {
                const maxFeaturesWPS = 5;
                const state = store.getState();
                const filterField = state.queryform.filterFields.filter((f) => f.rowId === action.rowId)[0];
                const data = getWpsPayload({
                        attribute: filterField.attribute,
                        layerName: state.query.typeName,
                        maxFeatures: maxFeaturesWPS,
                        startIndex: action.page * maxFeaturesWPS,
                        value: action.fieldValue
                    });
                return Rx.Observable.fromPromise(
                    axios.post("geoserver-test/wps?SERVICE=WPS&outputFormat=json", data, {
                        timeout: 60000,
                        headers: {'Accept': 'application/json', 'Content-Type': 'application/xml'}
                    }).then(res => res.data.values)
                ).switchMap((values) => {
                    let newOptions = isArray(values) ? values : [values];
                    return Rx.Observable.of(updateFilterFieldOptions(filterField, newOptions));
                })
                .startWith(loadingFilterFieldOptions(true, filterField))
                .catch( () => {
                    // console.log("error: " + e + " data:" + e.data);
                    return Rx.Observable.from([
                        updateFilterFieldOptions(filterField, [], action.fieldValue),
                        error({
                            title: "warning",
                            message: "warning", // TODO add tranlations
                            action: {
                                label: "warning" // TODO add tranlations
                            },
                            autoDismiss: 3,
                            position: "tr"
                        })
                    ]);
                })
                .concat([loadingFilterFieldOptions(false, filterField)]);
            })
};
