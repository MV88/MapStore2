import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import LMap from '../../../components/map/leaflet/Map';
import LLayer from '../../../components/map/leaflet/Layer';

class MyApp extends React.Component {
    static propTypes = {
        // redux store slice with map configuration (bound through connect to store at the end of the file)
        mapConfig: PropTypes.object,
        // redux store dispatch func
        dispatch: PropTypes.func
    };

    renderLayers = (layers) => {
        if (layers) {
            return layers.map(function(layer) {
                return <LLayer type={layer.type} key={layer.name} options={layer} />;
            });
        }
        return null;
    };

    render() {
        // wait for loaded configuration before rendering
        if (this.props.mapConfig && this.props.mapConfig.map) {
            return (
                <LMap id="map" center={this.props.mapConfig.map.center} zoom={this.props.mapConfig.map.zoom}>
                    {this.renderLayers(this.props.mapConfig.layers)}
                </LMap>
            );
        }
        return null;
    }
}

// include support for OSM and WMS layers
import '../../../components/map/leaflet/plugins/OSMLayer';

import '../../../components/map/leaflet/plugins/WMSLayer';

// connect Redux store slice with map configuration
export default connect((state) => {
    return {
        mapConfig: state.mapConfig
    };
})(MyApp);
