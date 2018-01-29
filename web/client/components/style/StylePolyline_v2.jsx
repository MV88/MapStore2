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
const assign = require('object-assign');
const ColorSelector = require('./ColorSelector');
const StyleCanvas = require('./StyleCanvas');
const Slider = require('react-nouislider');
const numberLocalizer = require('react-widgets/lib/localizers/simple-number');
numberLocalizer();
require('react-widgets/lib/less/react-widgets.less');
const {hexToRgbObj, rgbToHex} = require('../../utils/ColorUtils');

class StylePolyline extends React.Component {
    static propTypes = {
        width: PropTypes.number,
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
                                    shapeStyle={assign({}, this.props.shapeStyle, {
                                        color: this.addOpacityToColor(hexToRgbObj(this.props.shapeStyle.color), this.props.shapeStyle.opacity)
                                    })}
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
                            <ColorSelector color={this.addOpacityToColor(hexToRgbObj(this.props.shapeStyle.color), this.props.shapeStyle.opacity)}
                                width={this.props.width}
                                onChangeColor={c => {
                                    const color = rgbToHex(c.r, c.g, c.b);
                                    const opacity = c.a;
                                    const newStyle = assign({}, this.props.shapeStyle, {
                                        color,
                                        opacity
                                    });
                                    this.props.setStyleParameter(newStyle);
                                }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            Stroke Width:
                        </Col>
                        <Col xs={6} style={{position: 'static'}}>
                            <div className="mapstore-slider with-tooltip">
                                <Slider tooltips step={1}
                                    start={[this.props.shapeStyle.weight]}
                                    format={{
                                        from: value => Math.round(value),
                                        to: value => Math.round(value) + ' px'
                                    }}
                                    range={{min: 0, max: 20}}
                                    onChange={(values) => {
                                        const weight = parseInt(values[0].replace(' px', ''), 10);
                                        const newStyle = assign({}, this.props.shapeStyle, {
                                            weight
                                        });
                                        this.props.setStyleParameter(newStyle);
                                    }}
                                    />
                                </div>
                        </Col>
                    </Row>
                </Grid>);
    }
    addOpacityToColor = (color, opacity) => {
        return assign({}, color, {
            a: opacity
        });
    }
}

module.exports = StylePolyline;
