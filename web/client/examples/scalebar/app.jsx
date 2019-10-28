/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';
import DebugUtils from '../../utils/DebugUtils';
import { connect, Provider } from 'react-redux';
import { bindActionCreators, combineReducers } from 'redux';
import { changeBrowserProperties } from '../../actions/browser';
import ConfigUtils from '../../utils/ConfigUtils';
import Debug from '../../components/development/Debug';
import mapConfig from '../../reducers/map';
import browser from '../../reducers/browser';
import LMap from '../../components/map/leaflet/Map';
import LLayer from '../../components/map/leaflet/Layer';
import { changeMapView, changeZoomLevel } from '../../actions/map';
import ScaleBox from '../../components/mapcontrols/scale/ScaleBox';
import {Grid, Row, Col} from 'react-bootstrap';

// Here we create the store, we use Debug utils but is not necessary
// Instead we need to pass here map configuration
var store = DebugUtils.createDebugStore(combineReducers({browser, mapConfig}),
    {mapConfig: {
        zoom: 14,
        center: {
            y: 48.87,
            x: 2.32,
            crs: "EPSG:4326"
        },
        projection: "EPSG:900913"
    }, browser: {}});

import '../../components/map/leaflet/plugins/TileProviderLayer';

/**
* Detect Browser's properties and save in app state.
**/
store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));
const zoomLabelArray = ['-----------', '----------', '---------', '-------', '-------', '------', '-----',
    '----', '---', '--', '-', '+', '++', '+++', '++++', '+++++', '++++++', '+++++++', '++++++++',
    '+++++++++', '++++++++++', '+++++++++++' ];

class MyMap extends React.Component {
    static propTypes = {
        mapConfig: ConfigUtils.PropTypes.config,
        changeMapView: PropTypes.func,
        changeZoomLevel: PropTypes.func,
        browser: PropTypes.object,
        zoom: PropTypes.number
    };

    static defaultProps = {};

    render() {
        return (<div id="viewer" >
            <LMap key="map"
                center={this.props.mapConfig.center}
                zoom={this.props.mapConfig.zoom}
                projection={this.props.mapConfig.projection}
                onMapViewChanges={this.manageNewMapView}
            >
                <LLayer type="tileprovider" position={0} key="Staeman" options={{name: "Stamen", provider: "Stamen.TonerBackground"}} />
            </LMap>
            <Grid fluid={false} className="scalebargrid">
                <Row>
                    <Col lg={2} md={3} xs={4}>
                        <ScaleBox
                            id="scaleBox"
                            key="scaleBox"
                            onChange={this.props.changeZoomLevel}
                            currentZoomLvl={this.props.mapConfig.zoom} />
                    </Col>
                    <Col lg={2} lgOffset={3} md={3} mdOffset={1} xs={4}>
                        <ScaleBox
                            id="scaleBox2"
                            key="scaleBox2"
                            template={ (scale, index) => {
                                return index + 1;
                            }
                            }
                            onChange={this.props.changeZoomLevel}
                            currentZoomLvl={this.props.mapConfig.zoom} />
                    </Col>
                    <Col lg={2} lgOffset={3} md={3} mdOffset={2} xs={4} className="scaleBox1">
                        <ScaleBox
                            id="scaleBox1"
                            key="scaleBox1"
                            template={ (scale, index) => {
                                return zoomLabelArray[index];
                            }
                            }
                            onChange={this.props.changeZoomLevel}
                            currentZoomLvl={this.props.mapConfig.zoom} />
                    </Col>
                </Row>
            </Grid>
        </div>)
        ;
    }

    manageNewMapView = (center, zoom, bbox, size, mapStateSource) => {
        this.props.changeMapView(center, zoom, bbox, size, mapStateSource);
    };
}

let App = connect((state) => {
    return {
        mapConfig: state.mapConfig,
        browser: state.browser
    };
}, dispatch => {
    return bindActionCreators({changeMapView, changeZoomLevel}, dispatch);
})(MyMap);

ReactDOM.render(
    <Provider store={store}>
        <div>
            <App />
            <Debug/>
        </div>
    </Provider>,
    document.getElementById('container')
);
