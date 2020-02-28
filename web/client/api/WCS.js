/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import urlUtil from 'url';

import assign from 'object-assign';
import xml2js from 'xml2js';

import axios from '../libs/ajax';

const Api = {
    describeCoverage: function(url, typeName) {
        const parsed = urlUtil.parse(url, true);
        const describeLayerUrl = urlUtil.format(assign({}, parsed, {
            query: assign({
                service: "WCS",
                version: "1.1.0",
                identifiers: typeName,
                request: "DescribeCoverage"
            }, parsed.query)
        }));
        return axios.get(describeLayerUrl).then((response) => {
            let json;
            xml2js.parseString(response.data, {explicitArray: false}, (ignore, result) => {
                json = result;
            });
            return json;
        });
    }
};

export default Api;
