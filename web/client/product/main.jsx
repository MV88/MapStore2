/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

import {loadMaps} from '../actions/maps';
import {loadVersion} from '../actions/version';
import StandardApp from '../components/app/StandardApp';
import StandardRouterComp from '../components/app/StandardRouter';
import {setSupportedLocales} from '../epics/localconfig';
import {updateMapLayoutEpic} from '../epics/maplayout';
import {readQueryParamsOnMapEpic} from '../epics/queryparams';
import maplayout from '../reducers/maplayout';
import maps from '../reducers/maps';
import maptype from '../reducers/maptype';
import version from '../reducers/version';
import {loadAfterThemeSelector} from '../selectors/config';
import {versionSelector} from '../selectors/version';
import StandardStore from '../stores/StandardStore';
import ConfigUtils from '../utils/ConfigUtils';
import LocaleUtils from '../utils/LocaleUtils';

export default (config = {}, pluginsDef, overrideConfig = cfg => cfg) => {


    const startApp = () => {

        const {
            appEpics = {},
            baseEpics,
            appReducers = {},
            baseReducers,
            initialState,
            pages,
            printingEnabled = true,
            storeOpts,
            themeCfg = {},
            mode
        } = config;

        const StandardRouter = connect((state) => ({
            locale: state.locale || {},
            pages,
            themeCfg,
            version: versionSelector(state),
            loadAfterTheme: loadAfterThemeSelector(state)
        }))(StandardRouterComp);

        /**
         * appStore data needed to create the store
         * @param {object} baseReducers is used to override all the appReducers
         * @param {object} appReducers is used to extend the appReducers
         * @param {object} baseEpics is used to override all the appEpics
         * @param {object} appEpics is used to extend the appEpics
         * @param {object} initialState is used to initialize the state of the application
        */
        const appStore = StandardStore.bind(null,
            initialState,
            baseReducers || {
                maptype,
                maps,
                maplayout,
                version,
                ...appReducers
            },
            baseEpics || {
                updateMapLayoutEpic,
                setSupportedLocales,
                readQueryParamsOnMapEpic,
                ...appEpics
            }
        );

        const initialActions = [
            () => loadMaps(
                ConfigUtils.getDefaults().geoStoreUrl,
                ConfigUtils.getDefaults().initialMapFilter || "*"
            ),
            loadVersion
        ];

        const appConfig = overrideConfig({
            storeOpts,
            appEpics,
            appStore,
            pluginsDef,
            initialActions,
            appComponent: StandardRouter,
            printingEnabled,
            themeCfg,
            mode
        });

        ReactDOM.render(
            <StandardApp {...appConfig}/>,
            document.getElementById('container')
        );
    };

    if (!global.Intl ) {
        // Ensure Intl is loaded, then call the given callback
        LocaleUtils.ensureIntl(startApp);
    } else {
        startApp();
    }
};
