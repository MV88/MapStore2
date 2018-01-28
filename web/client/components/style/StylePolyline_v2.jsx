/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const PropTypes = require('prop-types');
const React = require('react');
const {Grid, Row, Col} = require('react-bootstrap');
const ColorPicker = require('./ColorPicker');
const StyleCanvas = require('./StyleCanvas');
const Slider = require('react-nouislider');
const numberLocalizer = require('react-widgets/lib/localizers/simple-number');
numberLocalizer();
require('react-widgets/lib/less/react-widgets.less');

class StylePolygon extends React.Component {
    static propTypes = {
        shapeStyle: PropTypes.object,
        setStyleParameter: PropTypes.func
    };

    static defaultProps = {
        shapeStyle: {},
        setStyleParameter: () => {}
    };

    render() {
        return (<Grid fluid style={{ width: '100%' }} className="ms-style">
                    <Row>
                        <Col xs={12}>
                            <div className="ms-marker-preview" style={{display: 'flex', width: '100%', height: 104}}>
                                <StyleCanvas style={{ padding: 0, margin: "auto", display: "block"}}
                                    shapeStyle={this.props.shapeStyle}
                                    geomType="Polyline"
                                    height={40}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            Stroke:
                        </Col>
                        <Col xs={6} style={{position: 'static'}}>
                            <ColorPicker color={{r: 33, g: 33, b: 33, a: 100}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            Stroke Width:
                        </Col>
                        <Col xs={6} style={{position: 'static'}}>
                            <div className="mapstore-slider with-tooltip">
                                <Slider tooltips start={[2]} format={{
                                           from: value => Math.round(value),
                                           to: value => Math.round(value) + ' px'
                                       }} range={{min: 0, max: 20}}/>
                                </div>
                        </Col>
                    </Row>
                </Grid>);
    }
}

module.exports = StylePolygon;
