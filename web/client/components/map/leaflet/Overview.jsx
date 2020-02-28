import PropTypes from 'prop-types';
import React from 'react';
import MiniMap from 'leaflet-minimap';
import L from 'leaflet';
import Layers from '../../../utils/leaflet/Layers';
import assign from 'object-assign';
import './overview.css';

const defaultOpt = { // For all configuration options refer to https://github.com/Norkart/Leaflet-MiniMap
    position: 'bottomright',
    width: 300,
    height: 150,
    collapsedWidth: 25,
    collapsedHeight: 25,
    zoomLevelOffset: -5,
    zoomLevelFixed: null,
    zoomAnimation: false,
    toggleDisplay: true,
    autoToggleDisplay: false,
    minimized: true
};

class Overview extends React.Component {
    static displayName = 'Overview';

    static propTypes = {
        map: PropTypes.object,
        overviewOpt: PropTypes.object,
        layers: PropTypes.array
    };

    static defaultProps = {
        id: 'overview',
        overviewOpt: {},
        layers: [{type: 'osm', options: {}}]
    };

    componentDidMount() {
        let opt = assign({}, defaultOpt, this.props.overviewOpt);
        if (this.props.layers) {
            let lfLayers = [];
            this.props.layers.forEach((layerOpt) => {
                lfLayers.push(Layers.createLayer(layerOpt.type, layerOpt.options || {}));
            });
            if (lfLayers.length === 1 ) {
                this.overview = new MiniMap(lfLayers[0], opt);
            } else if (lfLayers.length > 1 ) {
                this.overview = new MiniMap(L.layerGroup(lfLayers), opt);
            }
        }
        if (this.props.map && this.overview) {
            this.overview.addTo(this.props.map);
        }
    }

    render() {
        return null;
    }
}

export default Overview;
