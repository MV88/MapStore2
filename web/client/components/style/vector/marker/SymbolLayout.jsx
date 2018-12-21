/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const PropTypes = require('prop-types');
const React = require('react');
const {Row, Col, InputGroup, Glyphicon} = require('react-bootstrap');
const Select = require('react-select');
const Slider = require('react-nouislider');
const axios = require('axios');
const {isArray} = require('lodash');

const Message = require('../../../I18N/Message');

/**
 * Styler for the layout of the symbol
*/
class SymbolLayout extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        options: PropTypes.array,
        shape: PropTypes.string,
        onChange: PropTypes.func,
        onChangeShape: PropTypes.func,
        onUpdateOptions: PropTypes.func,
        width: PropTypes.number,
        symbolsPath: PropTypes.string
    };

    static defaultProps = {
        style: {},
        shape: "first-aid-kit",
        onChange: () => {},
        onUpdateOptions: () => {},
        onChangeShape: () => {}
    };

    state = {
        options: []
    }
    componentWillMount() {
        if (isArray(this.props.options) && this.props.options.length === 0) {
            this.loadSymbolsList();
        }
    }
    render() {
        // maybe we can use the original svg as the preview in the <Select> list
        const iconRenderer = (option) => {
            return (<div style={{ display: "flex", alignItems: "center" }}>
            <img src={option.iconUrl} width={25} height={25} />
            <span style={{ flex: 1, paddingLeft: 4 }}> {option.label}</span></div>);
        };
        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <strong><Message msgId="draw.marker.layout"/></strong>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Message msgId="draw.marker.shape"/>
                    </Col>
                    <Col xs={6} style={{ position: "static" }}>
                        <InputGroup>
                            <Select
                                clearable={false}
                                options={this.props.options}
                                value={this.props.shape}
                                onChange={(option) => {
                                    const shape = option && option.value;
                                    this.props.onChangeShape({shape});
                                }}
                                optionRenderer={iconRenderer}
                                valueRenderer={iconRenderer}
                            />
                        <InputGroup.Addon className="btn" onClick={this.loadSymbolsList}>
                                <Glyphicon glyph="refresh"/>
                            </InputGroup.Addon>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Message msgId="draw.marker.size"/>
                    </Col>
                    <Col xs={6} style={{ position: "static" }}>
                        <div className="mapstore-slider with-tooltip">
                            <Slider tooltips step={1}
                                start={[this.props.style.size || 32]}
                                format={{
                                    from: value => Math.round(value),
                                    to: value => Math.round(value) + " px"
                                }}
                                range={{ min: 1, max: 128 }}
                                onChange={(values) => {
                                    const size = parseInt(values[0].replace(" px", ""), 10);
                                    this.props.onChange({size: [size, size]}); // VERIFY THIS LATER ON WHEN RENDERING THIS STYLE
                                }}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    loadSymbolsList = () => {
        const testFolder = this.props.symbolsPath + "index.json";
        axios.get(testFolder, {"Content-type": "application/json"})
        .then(({data: symbols}) => {
            if (isArray(symbols)) {
                this.props.onUpdateOptions(
                    symbols.map(s => ({
                        label: s.label || s.name,
                        value: s.name,
                        iconUrl: this.props.symbolsPath + s.name + ".svg"
                    }))
                );
            }
        });
         // catch ?
    }

}

module.exports = SymbolLayout;
