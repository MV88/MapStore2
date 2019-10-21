/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { changeBrowserProperties } from '../../actions/browser';
import { loadLocale } from '../../actions/locale';
import ConfigUtils from '../../utils/ConfigUtils';
import LocaleUtils from '../../utils/LocaleUtils';
import PluginsUtils from '../../utils/PluginsUtils';
import assign from 'object-assign';

function startApp() {
    const {plugins, requires} = require('./plugins.js');
    const store = require('./stores/store')(plugins);
    const App = require('./containers/App');

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
    require.ensure(['intl', 'intl/locale-data/jsonp/en.js', 'intl/locale-data/jsonp/it.js'], (require) => {
        global.Intl = require('intl');
        require('intl/locale-data/jsonp/en.js');
        require('intl/locale-data/jsonp/it.js');
        startApp();
    });
} else {
    startApp();
}
