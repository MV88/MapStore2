/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import url from 'url';

import React from 'react';

if (!global.Symbol) {
    import("babel-polyfill");
}

const urlQuery = url.parse(window.location.href, true).query;

class Debug extends React.Component {
    async render() {
        if (urlQuery && urlQuery.debug && __DEVTOOLS__ && !window.devToolsExtension) {
            const DevTools = await import(
                /* webpackChunkName: "DevTools" */
                './DevTools');
            return (
                <DevTools/>
            );
        }
        return null;
    }
}

export default Debug;
