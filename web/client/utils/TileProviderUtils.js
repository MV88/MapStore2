/**
  * Copyright 2019, GeoSolutions Sas.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree.
  */

import { isArray } from 'lodash';

export function template(str = "", data = {}) {
    return str.replace(/(?!(\{?[zyx]?\}))\{*([\w_]+)*\}/g, function() {
        let st = arguments[0];
        let key = arguments[1] ? arguments[1] : arguments[2];
        let value = data[key];

        if (value === undefined) {
            throw new Error('No value provided for variable ' + st);

        } else if (typeof value === 'function') {
            value = value(data);
        }
        return value;
    });
}

/**
 * it will replace a wildcard with each subdomain
 * @param opt options to use
 * @return array of urls
*/
export function getUrls(opt = {}) {
    let url = opt.url || "";
    let subdomains = opt.subdomains || "";

    if (subdomains) {
        // subdomains can be a string or an array of chars
        if (typeof subdomains === "string") {
            subdomains = subdomains.split("");
        }
        if (isArray(subdomains)) {
            return subdomains.map( c => template(url.replace("{s}", c), opt));
        }
    }
    return ['a', 'b', 'c'].map( c => template(url.replace("{s}", c), opt));
}
