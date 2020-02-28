/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import url from 'url';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {changeBrowserProperties} from '../../actions/browser';
import {loadMapConfig} from '../../actions/config';
import {loadLocale} from '../../actions/locale';
import {loadPrintCapabilities} from '../../actions/print';
import ConfigUtils from '../../utils/ConfigUtils';
import LocaleUtils from '../../utils/LocaleUtils';
import Print from './containers/Print';
// initializes Redux store
import store from './stores/store';

const startApp = () => {


    // reads parameter(s) from the url
    const urlQuery = url.parse(window.location.href, true).query;

    // get configuration file url (defaults to config.json on the app folder)
    const { configUrl, legacy } = ConfigUtils.getConfigurationOptions(urlQuery, 'config', 'json');


    // dispatch an action to load the configuration from the config.json file
    store.dispatch(loadMapConfig(configUrl, legacy));

    store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));

    ConfigUtils.loadConfiguration().then(() => {
        store.dispatch(loadPrintCapabilities(ConfigUtils.getConfigProp('printUrl')));
    });


    // we spread the store to the all application
    // wrapping it with a Provider component
    class PrintApp extends React.Component {
        render() {
            return (
                <Provider store={store}>
                    <Print/>
                </Provider>);
        }
    }

    let locale = LocaleUtils.getUserLocale();
    store.dispatch(loadLocale('../../translations', locale));
    // Renders the application, wrapped by the Redux Provider to connect the store to components
    ReactDOM.render(<PrintApp/>, document.getElementById('container'));
};

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
