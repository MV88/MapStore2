import PropTypes from 'prop-types';

/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { connect } from 'react-redux';
import assign from 'object-assign';
import url from 'url';
const urlQuery = url.parse(window.location.href, true).query;

import ConfigUtils from '../utils/ConfigUtils';
import PluginsUtils from '../utils/PluginsUtils';

const PluginsContainer = connect((state) => ({
    statePluginsConfig: state.plugins,
    mode: urlQuery.mode || state.mode || (state.browser && state.browser.mobile ? 'mobile' : 'desktop'),
    pluginsState: assign({}, state && state.controls, state && state.layers && state.layers.settings && {
        layerSettings: state.layers.settings
    }),
    monitoredState: PluginsUtils.getMonitoredState(state, ConfigUtils.getConfigProp('monitorState'))
}))(require('../components/plugins/PluginsContainer'));

class MapViewer extends React.Component {
    static propTypes = {
        params: PropTypes.object,
        statePluginsConfig: PropTypes.object,
        pluginsConfig: PropTypes.object,
        loadMapConfig: PropTypes.func,
        plugins: PropTypes.object
    };

    static defaultProps = {
        mode: 'desktop',
        loadMapConfig: () => {}
    };

    UNSAFE_componentWillMount() {
        this.props.loadMapConfig();
    }

    render() {
        return (<PluginsContainer key="viewer" id="viewer" className="viewer"
            pluginsConfig={this.props.pluginsConfig || this.props.statePluginsConfig || ConfigUtils.getConfigProp('plugins')}
            plugins={this.props.plugins}
            params={this.props.params}
        />);
    }
}

export default MapViewer;
