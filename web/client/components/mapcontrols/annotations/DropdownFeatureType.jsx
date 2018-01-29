/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const {Glyphicon, DropdownButton, MenuItem} = require('react-bootstrap');
const tooltip = require('../../misc/enhancers/tooltip');
const {DEFAULT_ANNOTATIONS_STYLES} = require('../../../actions/annotations');
const React = require('react');
const uuidv1 = require('uuid/v1');


const DropdownButtonT = tooltip(DropdownButton);
const DropdownFeatureType = ({onClick = () => {}, onStopDrawing = () => {}, onSetStyle = () => {}, bsStyle = "primary", ...props} = {}) => (
    <DropdownButtonT id={props.idDropDown || uuidv1()} tooltip={props.tooltip} className="square-button-md" bsStyle={bsStyle} title={<Glyphicon glyph={props.glyph}/>} disabled={!!props.disabled} noCaret onClick={() => {onStopDrawing(); }}>
        <MenuItem onClick={() => { onClick("MultiPoint"); onSetStyle(props.style || DEFAULT_ANNOTATIONS_STYLES.Point); }} eventKey="1"><Glyphicon glyph="point"/>&nbsp; Marker</MenuItem>
        <MenuItem onClick={() => { onClick("MultiLineString"); onSetStyle(props.style || DEFAULT_ANNOTATIONS_STYLES.LineString); }} eventKey="2"><Glyphicon glyph="line"/>&nbsp; Line</MenuItem>
        <MenuItem onClick={() => { onClick("MultiPolygon"); onSetStyle(props.style || DEFAULT_ANNOTATIONS_STYLES.Polygon); }} eventKey="3"><Glyphicon glyph="polygon"/>&nbsp; Polygon</MenuItem>
    </DropdownButtonT>
);

module.exports = DropdownFeatureType;
