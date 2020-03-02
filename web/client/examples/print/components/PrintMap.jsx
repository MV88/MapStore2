/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import assign from 'object-assign';

import {changeMapView} from '../../../actions/map';

import PropTypes from 'prop-types';
import WMap from '../../../components/map/leaflet/Map';
import Layer from '../../../components/map/leaflet/Layer';
import Feature from '../../../components/map/leaflet/Feature';
import('../../../components/map/leaflet/plugins/index');

const PrintMap = (props) => {
    let features = props.features;
    return props.map ?

        <WMap {...props.map} {...props.actions}>
            {props.layers.map((layer, index) =>
                (<Layer key={layer.name} position={index} type={layer.type}
                    options={assign({}, layer, {srs: props.map.projection})}/>)
            )}
            <Layer type="vector" position={1} options={{name: "States"}}>
                {
                    features.map( (feature) => {
                        return (<Feature
                            key={feature.id}
                            type={feature.type}
                            geometry={feature.geometry}/>);
                    })
                }
            </Layer>
        </WMap>
        : <span/>;
};

PrintMap.propTypes = {
    mapType: PropTypes.string,
    features: PropTypes.array
};

PrintMap.defaultProps = {
    mapType: 'openlayers',
    features: []
};

export default connect((state) => {
    return {
        map: state.map && state.map || state.config && state.config.map,
        layers: state.config && state.config.layers || [],
        features: []
    };
}, dispatch => {
    return {
        actions: bindActionCreators({
            onMapViewChanges: changeMapView
        }, dispatch)
    };
})(PrintMap);
