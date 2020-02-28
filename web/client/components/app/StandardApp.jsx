/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import './appPolyfill';

import url from 'url';

import { isArray, isObject } from 'lodash';
import assign from 'object-assign';
const proj4 = require('proj4').default;
import PropTypes from 'prop-types';
import React from 'react';
import { DragDropContext as dragDropContext } from 'react-dnd';
import html5Backend from 'react-dnd-html5-backend';
import ErrorBoundary from 'react-error-boundary';
const ErrorBoundaryFallbackComponent = require('./ErrorFallBackComp').default;
import { Provider } from 'react-redux';

import { changeBrowserProperties } from '../../actions/browser';
import { localConfigLoaded } from '../../actions/localConfig';
import { loadLocale } from '../../actions/locale';
import { loadPrintCapabilities } from '../../actions/print';
import ConfigUtils from '../../utils/ConfigUtils';
import LocaleUtils from '../../utils/LocaleUtils';
import PluginsUtils from '../../utils/PluginsUtils';

const urlQuery = url.parse(window.location.href, true).query;

/**
 * Standard MapStore2 application component
 *
 * @name  StandardApp
 * @memberof components.app
 * @prop {function} appStore store creator function
 * @prop {object} pluginsDef plugins definition object (e.g. as loaded from plugins.js)
 * @prop {object} storeOpts options for the store
 * @prop {array} initialActions list of actions to be dispatched on startup
 * @prop {function|object} appComponent root component for the application
 * @prop {bool} printingEnabled initializes printing environment based on mapfish-print
 * @prop {function} onStoreInit optional callback called just after store creation
 * @prop {function} onInit optional callback called before first rendering, can delay first rendering
 * to do custom initialization (e.g. force SSO login)
 * @prop {string} mode current application mode (e.g. desktop/mobile) drives plugins loaded from localConfig
 */
class StandardApp extends React.Component {
    static propTypes = {
        appStore: PropTypes.func,
        pluginsDef: PropTypes.object,
        storeOpts: PropTypes.object,
        initialActions: PropTypes.array,
        appComponent: PropTypes.func,
        printingEnabled: PropTypes.bool,
        onStoreInit: PropTypes.func,
        onInit: PropTypes.func,
        mode: PropTypes.string
    };

    static defaultProps = {
        pluginsDef: {plugins: {}, requires: {}},
        initialActions: [],
        printingEnabled: false,
        appStore: () => ({dispatch: () => {}, getState: () => ({}), subscribe: () => {}}),
        appComponent: () => <span/>,
        onStoreInit: () => {}
    };

    state = {
        initialized: false
    };

    addProjDefinitions(config) {
        if (config.projectionDefs && config.projectionDefs.length) {
            config.projectionDefs.forEach((proj) => {
                proj4.defs(proj.code, proj.def);
            });

        }
    }

    UNSAFE_componentWillMount() {
        const onInit = (config) => {
            if (!global.Intl ) {
                require.ensure(['intl', 'intl/locale-data/jsonp/en.js', 'intl/locale-data/jsonp/it.js'], (require) => {
                    global.Intl = require('intl');
                    require('intl/locale-data/jsonp/en.js');
                    require('intl/locale-data/jsonp/it.js');
                    this.init(config);
                });
            } else {
                this.init(config);
            }
        };

        if (urlQuery.localConfig) {
            ConfigUtils.setLocalConfigurationFile(urlQuery.localConfig + '.json');
        }
        ConfigUtils.loadConfiguration().then((config) => {
            const opts = assign({}, this.props.storeOpts, {
                onPersist: onInit.bind(null, config)
            }, {
                initialState: this.parseInitialState(config.initialState, {
                    mode: this.props.mode || (ConfigUtils.getBrowserProperties().mobile ? 'mobile' : 'desktop')
                }) || {defaultState: {}, mobile: {}}
            });
            this.store = this.props.appStore(this.props.pluginsDef.plugins, opts);
            this.props.onStoreInit(this.store);

            if (!opts.persist) {
                onInit(config);
            }
        });

    }

    render() {
        const {plugins, requires} = this.props.pluginsDef;
        const {pluginsDef, appStore, initialActions, appComponent, mode, ...other} = this.props;
        const App = dragDropContext(html5Backend)(this.props.appComponent);

        return this.state.initialized ?
            <ErrorBoundary FallbackComponent={ ErrorBoundaryFallbackComponent}>
                <Provider store={this.store}>
                    <App {...other} plugins={assign(PluginsUtils.getPlugins(plugins), { requires })} />
                </Provider>
            </ErrorBoundary>
            : (<span><div className="_ms2_init_spinner _ms2_init_center"><div></div></div>
                <div className="_ms2_init_text _ms2_init_center">Loading MapStore</div></span>);
    }
    afterInit = () => {
        if (this.props.printingEnabled) {
            this.store.dispatch(loadPrintCapabilities(ConfigUtils.getConfigProp('printUrl')));
        }
        this.props.initialActions.forEach((action) => {
            this.store.dispatch(action());
        });
        this.setState({
            initialized: true
        });
    };
    init = (config) => {
        this.store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));
        this.store.dispatch(localConfigLoaded(config));
        this.addProjDefinitions(config);
        const locale = LocaleUtils.getUserLocale();
        this.store.dispatch(loadLocale(null, locale));
        if (this.props.onInit) {
            this.props.onInit(this.store, this.afterInit.bind(this, [config]), config);
        } else {
            this.afterInit(config);
        }
    };
    /**
     * It returns an object of the same structure of the initialState but replacing strings like "{someExpression}" with the result of the expression between brackets.
     * @param {object} state the object to parse
     * @param {object} context context for expression
     * @return {object} the modified object
    */
    parseInitialState = (state, context) => {
        return Object.keys(state || {}).reduce((previous, key) => {
            return { ...previous, ...{ [key]: isObject(state[key]) ?
                (isArray(state[key]) ? state[key].map(s => {
                    return isObject(s) ? this.parseInitialState(s, context) : s;
                }) : this.parseInitialState(state[key], context)) :
                PluginsUtils.handleExpression({}, context, state[key])}};
        }, {});
    };
}

export default StandardApp;
