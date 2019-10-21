import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// include application component
import MyApp from './containers/myapp';

import url from 'url';
import { loadMapConfig } from '../../actions/config';
import ConfigUtils from '../../utils/ConfigUtils';

// initializes Redux store
import store from './stores/myappstore';

// reads parameter(s) from the url
const urlQuery = url.parse(window.location.href, true).query;

// get configuration file url (defaults to config.json on the app folder)
const { configUrl, legacy } = ConfigUtils.getConfigurationOptions(urlQuery, 'config', 'json');

// dispatch an action to load the configuration from the config.json file
store.dispatch(loadMapConfig(configUrl, legacy));

// Renders the application, wrapped by the Redux Provider to connect the store to components
ReactDOM.render(
    <Provider store={store}>
        <MyApp />
    </Provider>,
    document.getElementById('container')
);
