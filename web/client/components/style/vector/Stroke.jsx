/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const PropTypes = require('prop-types');
const React = require('react');
const {Row, Col} = require('react-bootstrap');
const assign = require('object-assign');
const {isNil} = require('lodash');
const tinycolor = require("tinycolor2");
const Slider = require('react-nouislider');

// number localizer?
const numberLocalizer = require('react-widgets/lib/localizers/simple-number');
// not sure this is needed, TODO check!
numberLocalizer();
const Message = require('../../I18N/Message');
const OpacitySlider = require('../../TOC/fragments/OpacitySlider');
const ColorSelector = require('../ColorSelector');
const LineDash = require('./LineDash');

/**
 * Styler for the stroke properties of a vector style
*/
class Stroke extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        lineDashOptions: PropTypes.array,
        onChange: PropTypes.func,
        addOpacityToColor: PropTypes.func,
        width: PropTypes.number
    };

    static defaultProps = {
        style: {},
        lineDashOptions: [
            { value: "1, 0" },
            { value: "10, 50, 20" },
            { value: "30, 20" }
        ],
        onChange: () => {},
        addOpacityToColor: (color, opacity) => ( assign({}, color, { a: opacity }) )
    };

    render() {
        const {style} = this.props;
        return (<div>
            <Row>
                <Col xs={12}>
                    <strong><Message msgId="draw.stroke"/></strong>
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <Message msgId="draw.lineDash"/>
                </Col>
                <Col xs={6} style={{position: "static"}}>
                    <LineDash
                        options={this.props.lineDashOptions}
                        onChange={(lineDash) => {
                            this.props.onChange(style.id, {lineDash});
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <Message msgId="draw.color"/>
                </Col>
                <Col xs={6} style={{position: "static"}}>
                    <ColorSelector color={this.props.addOpacityToColor(tinycolor(style.color).toRgb(), style.opacity)} width={"100%" || this.props.width}
                        onChangeColor={c => {
                            if (!isNil(c)) {
                                const color = tinycolor(c).toHexString();
                                const opacity = c.a;
                                this.props.onChange(style.id, {color, opacity});
                            }
                        }}/>
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <Message msgId="draw.opacity"/>
                </Col>
                <Col xs={6} style={{position: 'static'}}>
                    <OpacitySlider
                        opacity={style.opacity}
                        onChange={(opacity) => {
                            this.props.onChange(style.id, {opacity});
                        }}/>
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <Message msgId="draw.width"/>
                </Col>
                <Col xs={6} style={{position: "static"}}>
                    <div className="mapstore-slider with-tooltip">
                        <Slider
                            tooltips
                            step={1}
                            start={[style.weight]}
                            format={{
                                from: value => Math.round(value),
                                to: value => Math.round(value) + ' px'
                            }}
                            range={{min: 1, max: 15}}
                            onChange={(values) => {
                                const weight = parseInt(values[0].replace(' px', ''), 10);
                                this.props.onChange("weight", {weight});
                            }}
                        />
                        </div>
                </Col>
            </Row>
        </div>);
    }
}

module.exports = Stroke;
