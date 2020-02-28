import PropTypes from 'prop-types';

/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { Grid, Col, Thumbnail, Glyphicon } from 'react-bootstrap';
import HYBRID from './images/mapthumbs/HYBRID.jpg';
import ROADMAP from './images/mapthumbs/ROADMAP.jpg';
import TERRAIN from './images/mapthumbs/TERRAIN.jpg';
import Aerial from './images/mapthumbs/Aerial.jpg';
import mapnik from './images/mapthumbs/mapnik.jpg';
import mapquestOsm from './images/mapthumbs/mapquest-osm.jpg';
import empty from './images/mapthumbs/none.jpg';
import unknown from './images/mapthumbs/dafault.jpg';
import Night2012 from './images/mapthumbs/NASA_NIGHT.jpg';
import AerialWithLabels from './images/mapthumbs/AerialWithLabels.jpg';
import OpenTopoMap from './images/mapthumbs/OpenTopoMap.jpg';
import './style.css';

let thumbs = {
    google: {
        HYBRID,
        ROADMAP,
        TERRAIN
    },
    bing: {
        Aerial,
        AerialWithLabels
    },
    osm: {
        mapnik
    },
    mapquest: {
        osm: mapquestOsm
    },
    ol: {
        "undefined": empty
    },
    nasagibs: {
        Night2012
    },
    OpenTopoMap: {
        OpenTopoMap
    },
    unknown
};

class BackgroundSwitcher extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        layers: PropTypes.array,
        columnProperties: PropTypes.object,
        propertiesChangeHandler: PropTypes.func,
        fluid: PropTypes.bool
    };

    static defaultProps = {
        id: "background-switcher",
        icon: <Glyphicon glyph="globe"/>,
        fluid: true,
        columnProperties: {
            xs: 12,
            sm: 12,
            md: 12
        }
    };

    renderBackgrounds = () => {
        if (!this.props.layers) {
            return <div />;
        }
        return this.renderLayers(this.props.layers);
    };

    renderLayers = (layers) => {
        let items = [];
        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            let thumb = thumbs[layer.source] && thumbs[layer.source][layer.name] || layer.thumbURL || thumbs.unknown;
            if (layer.invalid) {
                items.push(<Col {...this.props.columnProperties} key={i}>
                    <Thumbnail data-position={i} key={"bkg-swicher-item-" + i} bsStyle="warning" src={thumb} alt={layer.source + " " + layer.name}>
                        <div style={{height: '38px', textOverflow: 'ellipsis', overflow: 'hidden'}}><strong>{layer.title}</strong></div>
                    </Thumbnail>
                </Col>);
            } else {
                items.push(<Col {...this.props.columnProperties} key={i}>
                    <Thumbnail data-position={i} key={"bkg-swicher-item-" + i} bsStyle={layer.visibility ? "primary" : "default"} src={thumb} alt={layer.source + " " + layer.name}
                        onClick={this.changeLayerVisibility}>
                        <div style={{height: '38px', textOverflow: 'ellipsis', overflow: 'hidden'}}><strong>{layer.title}</strong></div>
                    </Thumbnail>
                </Col>);
            }

        }
        return items;
    };

    render() {
        return (
            <Grid id={this.props.id} className="BackgroundSwitcherComponent" fluid={this.props.fluid}>{this.renderBackgrounds()}</Grid>
        );
    }

    changeLayerVisibility = (eventObj) => {
        let position = parseInt(eventObj.currentTarget.dataset.position, 10);
        var layer = this.props.layers[position];
        this.props.propertiesChangeHandler(layer.id, {visibility: true});
    };
}

export default BackgroundSwitcher;
