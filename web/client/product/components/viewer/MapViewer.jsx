/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const React = require('react');
const PropTypes = require('prop-types');
const url = require('url');
const urlQuery = url.parse(window.location.href, true).query;
const ConfigUtils = require('../../../utils/ConfigUtils');
const MapViewer = require('../../../containers/MapViewer');
require('../../assets/css/viewer.css');
let oldLocation;

class MapViewerComponent extends React.Component {
    static propTypes = {
        mode: PropTypes.string,
        match: PropTypes.object,
        loadMapConfig: PropTypes.func,
        onInit: PropTypes.func,
        plugins: PropTypes.object,
        location: PropTypes.object
    };
    static defaultProps = {
        mode: 'desktop',
        plugins: {},
        match: {
            params: {}
        }
    };
    componentWillMount() {
        if (this.props.match.params.mapId && oldLocation !== this.props.location) {
            oldLocation = this.props.location;
            if (!ConfigUtils.getDefaults().ignoreMobileCss) {
                if (this.props.mode === 'mobile') {
                    require('../../assets/css/mobile.css');
                }
            }
            // if 0 it loads config.json
            // if mapId is a string it loads mapId.json
            // if it is a number it loads the config from geostore
            let mapId = this.props.match.params.mapId === '0' ? null : this.props.match.params.mapId;
            let config = urlQuery && urlQuery.config || null;
            const {configUrl} = ConfigUtils.getConfigUrl({mapId, config});
            mapId = mapId === 'new' ? null : mapId;
            this.props.onInit();
            this.props.loadMapConfig(configUrl, mapId);
        }
    }
    render() {
        return (<MapViewer
            plugins={this.props.plugins}
            params={this.props.match.params}
            />);
    }
}

module.exports = MapViewerComponent;
