/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Promise } from 'es6-promise';
import { castArray, merge } from 'lodash';

import axios from '../libs/ajax';
import ConfigUtils from '../utils/ConfigUtils';
import LocaleUtils from '../utils/LocaleUtils';
import { error } from './notifications';

export const CHANGE_LOCALE = 'CHANGE_LOCALE';
export const LOCALE_LOAD_ERROR = 'LOCALE_LOAD_ERROR';

function changeLocale(data) {
    return {
        type: CHANGE_LOCALE,
        messages: data.messages,
        locale: data.locale
    };
}

function localeError(e) {
    return {
        type: LOCALE_LOAD_ERROR,
        error: e
    };
}

export function loadLocale(translationFolder, language) {
    return (dispatch) => {
        let locale = language;
        if (!locale) {
            locale = LocaleUtils.getUserLocale();
        }
        const folders = castArray(translationFolder || ConfigUtils.getConfigProp('translationsPath'));
        Promise.all(folders.map((folder) => {
            return axios.get(folder + '/data.' + locale);
        })).then((responses) => {
            dispatch(changeLocale(responses.reduce((previous, response) => {
                if (typeof response.data === "string") {
                    try {
                        JSON.parse(response.data);
                    } catch (e) {
                        dispatch(localeError('Locale file broken  for (' + language + '): ' + e.message));
                    }
                    return previous;
                }
                return merge(previous, response.data);
            }, {})));
        }).catch((e) => {
            dispatch(localeError(e));
            dispatch(error({
                title: "notification.warning",
                message: e.status === 404 ? "localeErrors.404" : "Error loading locale",
                action: {
                    label: "notification.warning"
                },
                position: "tc"
            }));

        });
    };
}
