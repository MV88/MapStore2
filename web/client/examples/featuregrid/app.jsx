/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assign from 'object-assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { changeBrowserProperties } from '../../actions/browser';
import { loadLocale } from '../../actions/locale';
import ConfigUtils from '../../utils/ConfigUtils';
import LocaleUtils from '../../utils/LocaleUtils';
import PluginsUtils from '../../utils/PluginsUtils';
import App from './containers/App';
import {plugins, requires} from './plugins.js';
import store from './stores/store';

function startApp() {
    store(plugins);

    store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));
    ConfigUtils.loadConfiguration().then(() => {
        let locale = LocaleUtils.getUserLocale();
        store.dispatch(loadLocale('../../translations', locale));
    });

    ReactDOM.render(
        <Provider store={store}>
            <App plugins={assign(PluginsUtils.getPlugins(plugins), {requires})}/>
        </Provider>,
        document.getElementById('container')
    );
}
if (!global.Intl ) {
    import(
        /* webpackChunkName: "intl" */
        'intl').then(module => {
        // TODO CHECK THIS IS OK
        global.Intl = module;
        import('intl/locale-data/jsonp/en.js');
        import('intl/locale-data/jsonp/it.js');
        startApp();
    });
} else {
    startApp();
}
