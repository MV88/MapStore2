/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import url from 'url';

import { isObject } from 'lodash';
import { addLocaleData } from 'react-intl';
import de from 'react-intl/locale-data/de';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import hr from 'react-intl/locale-data/hr';
import it from 'react-intl/locale-data/it';
import nl from 'react-intl/locale-data/nl';
import pt from 'react-intl/locale-data/pt';
import vi from 'react-intl/locale-data/vi';
import zh from 'react-intl/locale-data/zh';

addLocaleData([...en, ...it, ...fr, ...de, ...es, ...nl, ...zh, ...hr, ...pt, ...vi]);

/*
 * it, en, fr, de, es are the default locales and it is preferrable to customize them via configuration.
 * if you want to change it please read documentation guide on how to do this.
*/
let supportedLocales = {
    "it": {
        code: "it-IT",
        description: "Italiano"
    },
    "en": {
        code: "en-US",
        description: "English"
    },
    "fr": {
        code: "fr-FR",
        description: "Français"
    },
    "de": {
        code: "de-DE",
        description: "Deutsch"
    },
    "es": {
        code: "es-ES",
        description: "Español"
    },
    "zh": {
        code: "zh-ZH",
        description: "中文"
    },
    "nl": {
        code: "nl-NL",
        description: "Nederlands"
    },
    "hr": {
        code: "hr-HR",
        description: "Hrvatski"
    },
    "pt": {
        code: "pt-PT",
        description: "Português"
    },
    "vi": {
        code: "vi-VN",
        description: "tiếng Việt"
    }
};
export const DATE_FORMATS = {
    "default": "YYYY/MM/DD",
    "en-US": "MM/DD/YYYY",
    "it-IT": "DD/MM/YYYY",
    "nl-NL": "DD/MM/YYYY",
    "zh-ZH": "YYYY/MM/DD",
    "hr-HR": "DD/MM/YYYY",
    "pt-PT": "DD/MM/YYYY",
    "vi-VN": "DD/MM/YYYY"
};

let errorParser = {};

/**
 * Utilities for locales.
 * @memberof utils
 */
export const ensureIntl = async(callback) => {
    global.Intl = await import(
        /* webpackChunkName: "intl" */
        'intl');
    import('intl/locale-data/jsonp/en.js');
    import('intl/locale-data/jsonp/it.js');
    import('intl/locale-data/jsonp/fr.js');
    import('intl/locale-data/jsonp/de.js');
    import('intl/locale-data/jsonp/es.js');
    import('intl/locale-data/jsonp/nl.js');
    import('intl/locale-data/jsonp/zh.js');
    import('intl/locale-data/jsonp/hr.js');
    import('intl/locale-data/jsonp/pt.js');
    import('intl/locale-data/jsonp/vi.js');
    if (callback) {
        callback();
    }
};
export const setSupportedLocales = (locales) => {
    supportedLocales = locales;
};
export const normalizeLocaleCode = (localeCode) => {
    var retval;
    if (localeCode === undefined || localeCode === null) {
        retval = undefined;
    } else {
        let rg = /^[a-z]+/i;
        let match = rg.exec(localeCode);
        if (match && match.length > 0) {
            retval = match[0].toLowerCase();
        } else {
            retval = undefined;
        }
    }
    return retval;
};
export const getLocale = (query = {}) => {
    const key = Object.keys(supportedLocales)[0];
    const defaultLocale = supportedLocales.en ? { key: 'en', locale: supportedLocales.en } : { key, locale: supportedLocales[key] };
    let locale = supportedLocales[
        normalizeLocaleCode(query.locale || (navigator ? navigator.language || navigator.browserLanguage : defaultLocale.key))
    ];
    return locale ? locale.code : defaultLocale.locale.code;
};
export const getUserLocale = () => {
    return getLocale(url.parse(window.location.href, true).query);
};
export const getSupportedLocales = () => {
    return supportedLocales;
};
export const getDateFormat = (locale) => {
    return DATE_FORMATS[locale] || DATE_FORMATS.default;
};
export const getMessageById = (messages, msgId) => {
    var message = messages;
    msgId.split('.').forEach(part => {
        message = message ? message[part] : null;
    });
    return message || msgId;
};
/**
 * Register a parser to translate error services
 * @param type {string} name of the service
 * @param parser {object} custom parser of the service
 */
export const registerErrorParser = (type, parser) => {
    errorParser[type] = parser;
};
/**
 * Return localized id of error messages
 * @param e {object} error
 * @param service {string} service that thrown the error
 * @param section {string} section where the error happens
 * @return {object} {title, message}
 */
export const getErrorMessage = (e, service, section) => {
    return service && section && errorParser[service] && errorParser[service][section] && errorParser[service][section](e) || {
        title: 'errorTitleDefault',
        message: 'errorDefault'
    };
};
/**
 * Retrieve localized string from object of translations
 * @param {string} locale code of locale, eg. en-US
 * @param {string|object} prop source of translation
 * @returns {string} localized string
 */
export const getLocalizedProp = (locale, prop) => isObject(prop) ? prop[locale] || prop.default : prop || '';

const LocaleUtils = {
    ensureIntl,
    setSupportedLocales,
    normalizeLocaleCode,
    getUserLocale,
    getLocale,
    getSupportedLocales,
    getDateFormat,
    DATE_FORMATS,
    getMessageById,
    registerErrorParser,
    getErrorMessage,
    getLocalizedProp
};


export default LocaleUtils;
