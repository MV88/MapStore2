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

// initializes Redux store
import store from './stores/store';

import { loadMapConfig } from '../../actions/config';
import { changeBrowserProperties } from '../../actions/browser';
import { loadLocale } from '../../actions/locale';
import ConfigUtils from '../../utils/ConfigUtils';
import LocaleUtils from '../../utils/LocaleUtils';
import url from 'url';

// reads parameter(s) from the url
const urlQuery = url.parse(window.location.href, true).query;

// get configuration file url (defaults to config.json on the app folder)
const { configUrl, legacy } = ConfigUtils.getConfigurationOptions(urlQuery, 'config', 'json');

// dispatch an action to load the configuration from the config.json file
store.dispatch(loadMapConfig(configUrl, legacy));

store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));

import Login from './containers/Login';

// we spread the store to the all application
// wrapping it with a Provider component
class LoginApp extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Login/>
            </Provider>);
    }
}

let locale = LocaleUtils.getUserLocale();
store.dispatch(loadLocale('../../translations', locale));

const startApp = () => {
    // Renders the application, wrapped by the Redux Provider to connect the store to components
    ReactDOM.render(<LoginApp/>, document.getElementById('container'));
};

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
