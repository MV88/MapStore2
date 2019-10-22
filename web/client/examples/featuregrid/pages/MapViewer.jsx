/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import url from 'url';

import '../../../product/assets/css/viewer.css';
import ConfigUtils from '../../../utils/ConfigUtils';
import { loadMapConfig } from '../../../actions/config';
import { resetControls } from '../../../actions/controls';
import PluginsContainerComp from '../../../components/plugins/PluginsContainer';

const urlQuery = url.parse(window.location.href, true).query;
const PluginsContainer = connect((state) => ({
    pluginsConfig: state.plugins || ConfigUtils.getConfigProp('plugins') || null,
    mode: urlQuery.mobile || state.browser && state.browser.touch ? 'mobile' : 'desktop'
}))(PluginsContainerComp);


class MapViewer extends React.Component {
    static propTypes = {
        mode: PropTypes.string,
        params: PropTypes.object,
        loadMapConfig: PropTypes.func,
        reset: PropTypes.func,
        plugins: PropTypes.object
    };

    static defaultProps = {
        mode: 'desktop'
    };

    UNSAFE_componentWillMount() {
        if (this.props.params.mapType && this.props.params.mapId) {

            const mapId = this.props.params.mapId === '0' ? null : this.props.params.mapId;
            const config = urlQuery && urlQuery.config || null;
            const {configUrl} = ConfigUtils.getConfigurationOptions({mapId, config});
            this.props.reset();
            this.props.loadMapConfig(configUrl, mapId !== null);
        }
    }

    render() {
        return (<PluginsContainer key="viewer" id="viewer" className="viewer"
            plugins={this.props.plugins}
            params={this.props.params}
        />);
    }
}

export default connect((state) => ({
    mode: urlQuery.mobile || state.browser && state.browser.touch ? 'mobile' : 'desktop'
}),
{
    loadMapConfig,
    reset: resetControls
})(MapViewer);
