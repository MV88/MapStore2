/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {loadMapConfig} from '../../actions/config';
import {loadLocale} from '../../actions/locale';
import ConfigUtils from '../../utils/ConfigUtils';
import LocaleUtils from '../../utils/LocaleUtils';
// include application component
import Viewer from './containers/Viewer';
// initializes Redux store
import store from './stores/store';

const startApp = () => {

    ConfigUtils.loadConfiguration().then(() => {
        const { configUrl, legacy } = ConfigUtils.getUserConfiguration('config', 'json');
        store.dispatch(loadMapConfig(configUrl, legacy));

        let locale = LocaleUtils.getUserLocale();
        store.dispatch(loadLocale('../../translations', locale));
    });

    // Renders the application, wrapped by the Redux Provider to connect the store to components
    ReactDOM.render(
        <Provider store={store}>
            <Viewer />
        </Provider>,
        document.getElementById('container')
    );
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
