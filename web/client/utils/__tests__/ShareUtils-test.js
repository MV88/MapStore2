/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import expect from 'expect';

import { getAbsoluteURL, getConfigUrl, getApiUrl, removeQueryFromUrl, getSharedGeostoryUrl } from '../ShareUtils';


const MAPSTORE_PATH = "/mapstore/";
const MAP_HASH_PATH = "#/viewer/leaflet/";
const GEOSTORE_DATA_PATH = "data/";
const QUERY_STRING = "?config=myCustomConfig";
const MS_GEOSTORE_EMBEDDED_PATH = "/mapstore/rest/geostore/";
const STANDALONE_GEOSTORE_PATH = "/geostore/rest/";

const LOCALURL = "http://localhost:8081";
const SOMEHOST = "http://somehost.it";
const DEV_URL = "http://dev.mapstore.geo-solutions.it";

const LOCALURL_PATH = LOCALURL + MAPSTORE_PATH;
const DEV_URL_PATH = DEV_URL + MAPSTORE_PATH;
const DEV_URL_MAP_PATH = DEV_URL_PATH + MAP_HASH_PATH;
const SOMEHOST_PATH = SOMEHOST + MAPSTORE_PATH;
const SOMEHOST_PATH_QUERY_STRING = SOMEHOST_PATH + QUERY_STRING;
const EXTERNAL_GEOSTORE = "http://dev.mapstore.geo-solutions.it/geostore/rest/";

describe('ShareUtils test', () => {
    it('getAbsoluteURL', () => {
        expect(getAbsoluteURL(LOCALURL, MS_GEOSTORE_EMBEDDED_PATH)).toBe( LOCALURL + MS_GEOSTORE_EMBEDDED_PATH );
        expect(getAbsoluteURL(DEV_URL, MS_GEOSTORE_EMBEDDED_PATH)).toBe(DEV_URL + MS_GEOSTORE_EMBEDDED_PATH);
        expect(getAbsoluteURL(DEV_URL_PATH, MS_GEOSTORE_EMBEDDED_PATH)).toBe(DEV_URL + MS_GEOSTORE_EMBEDDED_PATH);
        expect(getAbsoluteURL(SOMEHOST_PATH, STANDALONE_GEOSTORE_PATH)).toBe(SOMEHOST + STANDALONE_GEOSTORE_PATH);
        expect(getAbsoluteURL(SOMEHOST_PATH_QUERY_STRING, STANDALONE_GEOSTORE_PATH)).toBe(SOMEHOST + STANDALONE_GEOSTORE_PATH);
        expect(getAbsoluteURL(SOMEHOST_PATH_QUERY_STRING, EXTERNAL_GEOSTORE)).toBe(EXTERNAL_GEOSTORE);
    });
    it('getConfigUrl', () => {
        expect(getConfigUrl(DEV_URL_MAP_PATH + "1", MS_GEOSTORE_EMBEDDED_PATH)).toBe(DEV_URL + MS_GEOSTORE_EMBEDDED_PATH + GEOSTORE_DATA_PATH + "1");
        expect(getConfigUrl(DEV_URL_MAP_PATH + "11", MS_GEOSTORE_EMBEDDED_PATH)).toBe(DEV_URL + MS_GEOSTORE_EMBEDDED_PATH + GEOSTORE_DATA_PATH + "11");
        expect(getConfigUrl(DEV_URL_MAP_PATH + "111", MS_GEOSTORE_EMBEDDED_PATH)).toBe(DEV_URL + MS_GEOSTORE_EMBEDDED_PATH + GEOSTORE_DATA_PATH + "111");
        expect(getConfigUrl(DEV_URL_MAP_PATH + "111?abc=def", MS_GEOSTORE_EMBEDDED_PATH)).toBe(DEV_URL + MS_GEOSTORE_EMBEDDED_PATH + GEOSTORE_DATA_PATH + "111");
        expect(getConfigUrl(DEV_URL_MAP_PATH, MS_GEOSTORE_EMBEDDED_PATH)).toBe(DEV_URL + MS_GEOSTORE_EMBEDDED_PATH + GEOSTORE_DATA_PATH);
        expect(getConfigUrl(SOMEHOST_PATH, MS_GEOSTORE_EMBEDDED_PATH)).toBe(null);
    });
    it('getApiUrl', () => {
        expect(getApiUrl(DEV_URL_MAP_PATH)).toBe(DEV_URL_PATH);
        expect(getApiUrl(LOCALURL_PATH)).toBe(LOCALURL_PATH);
        expect(getApiUrl(LOCALURL_PATH + MAPSTORE_PATH + QUERY_STRING)).toBe(LOCALURL_PATH + MAPSTORE_PATH);
    });
    it('removeQueryFromUrl', () => {
        const expectedUrl = 'http://my-url/#/viewer/openlayers/1';
        const urlWithQueries = 'http://my-url/?debug=true#/viewer/openlayers/1?bbox=minx,miny,maxx,maxy';
        const urlWithoutQueries = removeQueryFromUrl(urlWithQueries);
        expect(urlWithoutQueries).toBe(expectedUrl);
    });
    it('getSharedGeostoryUrl', () => {
        const expectedURL = 'http://test-url/#/geostory/shared/111';
        expect(getSharedGeostoryUrl(expectedURL)).toBe(expectedURL);
        expect(getSharedGeostoryUrl('http://test-url/#/geostory/111')).toBe(expectedURL);
        expect(getSharedGeostoryUrl('http://test-url/#/geostory/newgeostory')).toBe('http://test-url/#/geostory/newgeostory');
        expect(getSharedGeostoryUrl('http://test-url/#/other')).toBe('http://test-url/#/other');
    });
});
