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
import { createStore, combineReducers } from 'redux';
import { changeBrowserProperties } from '../../actions/browser';
import ConfigUtils from '../../utils/ConfigUtils';
import Localized from '../../components/I18N/Localized';
import browser from '../../reducers/browser';
import { Modal, Grid, Row, Col, Button } from 'react-bootstrap';
import LMap from '../../components/map/leaflet/Map';
import LLayer from '../../components/map/leaflet/Layer';
import mouseposition from '../../reducers/mousePosition';
import { changeMousePosition } from '../../actions/mousePosition';
var store = createStore(combineReducers({browser, mouseposition}));

import '../../components/map/leaflet/plugins/OSMLayer';
import './components/mouseposition.css';
import MousePosition from "../../components/mapcontrols/mouseposition/MousePosition";
import LabelDD from "../../components/mapcontrols/mouseposition/MousePositionLabelDD";
import LabelDM from "../../components/mapcontrols/mouseposition/MousePositionLabelDM";
import LabelDMSNW from "../../components/mapcontrols/mouseposition/MousePositionLabelDMSNW";
import SearchGeoS from "./components/FindGeoSolutions.jsx";

function startApp() {

    /**
    * Detect Browser's properties and save in app state.
    **/

    store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));

    class App extends React.Component {
        static propTypes = {
            browser: PropTypes.object,
            mousePosition: PropTypes.object
        };

        static defaultProps = {
            browser: {touch: false}
        };

        state = {
            showAlert: false
        };

        onCopy = () => {
            this.setState({showAlert: true});
        };

        render() {
            if (this.props.browser.touch) {
                return <div className="error">This example does not work on mobile</div>;
            }
            return (<Localized locale="it-IT" messages={{}}>
                <div id="viewer" >
                    <Modal show={this.state.showAlert} onHide={this.closeAlert}>
                        <Modal.Header closeButton>
                            <Modal.Title>Clipboard</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                Succesfully copied to clipboard!
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.closeAlert}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                    <Grid fluid={false} className="mousepositionsbar">
                        <Row>
                            <Col lg={4} md={6} xs={12}>
                                <MousePosition id="sGeoS" key="sGeoS"
                                    mousePosition={this.props.mousePosition} crs="EPSG:4326"
                                    degreesTemplate={SearchGeoS}/>
                            </Col>
                            <Col lg={4} md={6} xs={12}>
                                <MousePosition
                                    copyToClipboardEnabled
                                    onCopy={this.onCopy}
                                    id="wgs84" key="wgs84" mousePosition={this.props.mousePosition} crs="EPSG:4326"/>
                            </Col>
                            <Col lg={4} md={4} xs={6}>
                                <MousePosition id="degreedecimal" key="degreedecimal" enabled
                                    mousePosition={this.props.mousePosition} crs="EPSG:4326"
                                    degreesTemplate={LabelDD}/>
                            </Col>
                        </Row></Grid>
                    <MousePosition id="google"
                        copyToClipboardEnabled
                        onCopy={this.onCopy}
                        key="google_prj" mousePosition={this.props.mousePosition} crs="EPSG:900913"/>

                    <MousePosition id="degreeminute" key="degreeminute"
                        mousePosition={this.props.mousePosition} crs="EPSG:4326"
                        degreesTemplate={LabelDM}/>
                    <MousePosition id="dmsnw" key="dmsnw"
                        mousePosition={this.props.mousePosition} crs="EPSG:4326"
                        degreesTemplate={LabelDMSNW}/>
                    <LMap key="map"
                        center={{
                            y: 43.878160,
                            x: 10.276508,
                            crs: "EPSG:4326"
                        }}
                        zoom={13}
                        projection="EPSG:900913"
                        onMouseMove={ (posi) => { store.dispatch(changeMousePosition(posi)); }}
                        mapStateSource="map"
                    >
                        <LLayer type="osm" position={0} key="osm" options={{name: "osm"}} />
                    </LMap>
                </div>
            </Localized>)
            ;
        }

        closeAlert = () => {
            this.setState({showAlert: false});
        };
    }

    ReactDOM.render(<App/>, document.getElementById('container'));
    store.subscribe(() =>
        ReactDOM.render(<App mousePosition={store.getState().mouseposition.position}
            browser={store.getState().browser}/>, document.getElementById('container')));
}

if (!global.Intl ) {
    require.ensure(['intl', 'intl/locale-data/jsonp/en.js', 'intl/locale-data/jsonp/it.js'], (require) => {
        global.Intl = require('intl');
        require('intl/locale-data/jsonp/en.js');
        require('intl/locale-data/jsonp/it.js');
        startApp();
    });
} else {
    startApp();
}
