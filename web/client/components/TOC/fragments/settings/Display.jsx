/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import PropTypes from 'prop-types';
import { DropdownList } from 'react-widgets';
import Message from '../../../I18N/Message';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox } from 'react-bootstrap';
import { clamp, isNil } from 'lodash';
import 'react-widgets/lib/less/react-widgets.less';

export default class extends React.Component {
    static propTypes = {
        opacityText: PropTypes.node,
        element: PropTypes.object,
        formats: PropTypes.array,
        settings: PropTypes.object,
        onChange: PropTypes.func
    };

    static defaultProps = {
        onChange: () => {},
        opacityText: <Message msgId="opacity"/>
    };

    state = {
        opacity: 100
    };

    componentDidMount() {
        if (this.props.settings && this.props.settings.options && !isNil(this.props.settings.options.opacity)) {
            this.setState({ opacity: Math.round(this.props.settings.options.opacity * 100)});
        }
    }

    render() {
        return (
            <Grid
                fluid
                style={{paddingTop: 15, paddingBottom: 15}}>
                {this.props.element.type === "wms" &&
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel><Message msgId="layerProperties.format" /></ControlLabel>
                            <DropdownList
                                key="format-dropdown"
                                data={this.props.formats || ["image/png", "image/png8", "image/jpeg", "image/vnd.jpeg-png", "image/gif"]}
                                value={this.props.element && this.props.element.format || "image/png"}
                                onChange={(value) => {
                                    this.props.onChange("format", value);
                                }}/>
                        </FormGroup>
                    </Col>
                </Row>}

                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>{this.props.opacityText} %</ControlLabel>
                            <FormControl
                                type="number"
                                min={0}
                                max={100}
                                value={this.state.opacity}
                                onChange={event => {
                                    const value = event.target.value;
                                    const opacity = value && clamp(Math.round(value), 0, 100);
                                    this.setState({opacity});
                                    this.props.onChange("opacity", opacity && (opacity / 100) || 0);
                                }}/>
                        </FormGroup>
                    </Col>
                </Row>

                {this.props.element.type === "wms" &&
                <Row>
                    <Col xs={12}>
                        <hr/>
                        <FormGroup>
                            <Checkbox key="transparent" checked={this.props.element && (this.props.element.transparent === undefined ? true : this.props.element.transparent)} onChange={(event) => {this.props.onChange("transparent", event.target.checked); }}>
                                <Message msgId="layerProperties.transparent"/></Checkbox>
                            <Checkbox key="cache" value="tiled" key="tiled"
                                disabled={!!this.props.element.singleTile}
                                onChange={(e) => this.props.onChange("tiled", e.target.checked)}
                                checked={this.props.element && this.props.element.tiled !== undefined ? this.props.element.tiled : true} >
                                <Message msgId="layerProperties.cached"/>
                            </Checkbox>
                            <Checkbox key="singleTile" value="singleTile" key="singleTile"
                                checked={this.props.element && (this.props.element.singleTile !== undefined ? this.props.element.singleTile : false )}
                                onChange={(e) => this.props.onChange("singleTile", e.target.checked)}>
                                <Message msgId="layerProperties.singleTile"/>
                            </Checkbox>
                        </FormGroup>
                    </Col>
                </Row>}
            </Grid>
        );
    }
}
