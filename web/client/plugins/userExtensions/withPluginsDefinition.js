/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { compose, mapPropsStream, withPropsOnChange } from "recompose";
import { find, pick } from 'lodash';

import Rx from 'rxjs';
import loadingState from '../../components/misc/enhancers/loadingState';

import getPluginsConfig from '../../observables/config/getPluginsConfig';
/**
 * Adds to user extensions the plugins definition and maps the properties
 * needed (title, description and glyph) to correctly set labels and symbology,
 * accordingly with the context manager.
 */
export default (pluginsConfigURL) => compose(
    mapPropsStream(props$ =>
        props$.combineLatest(
            Rx.Observable.defer(() => getPluginsConfig(pluginsConfigURL))
                .map((pluginsConfig) => ({ pluginsConfig, loading: false }))
                .catch(e => Rx.Observable.of({loading: false, pluginsLoadError: e}))
                .startWith({ loading: true }),
            (p1, p2) => ({ ...p1, ...p2 })
        )
    ),
    withPropsOnChange(['pluginsConfig', 'extensions'], ({ extensions = [], pluginsConfig = { plugins: [] } }) => ({
        extensions: extensions.map( (e = {}) => {
            const pluginConfig = pick(find(pluginsConfig.plugins, {name: e.name}), ['title', 'description', 'glyph']) || {};
            return {
                ...e,
                ...pluginConfig
            };
        })
    })),
    loadingState()
);
