/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const {Glyphicon, DropdownButton, MenuItem} = require('react-bootstrap');
const tooltip = require('../../misc/enhancers/tooltip');
const {DEFAULT_ANNOTATIONS_STYLES} = require('../../../utils/AnnotationsUtils');
const React = require('react');
const uuidv1 = require('uuid/v1');
const assign = require('object-assign');

const getStyle = (type, style, defaultStyle = DEFAULT_ANNOTATIONS_STYLES) => {
    return assign({}, style, {
        [type]: assign({}, defaultStyle[type], style[type]),
        type
    });
};

const DropdownButtonT = tooltip(DropdownButton);
const DropdownFeatureType = ({onClick = () => {}, onStopDrawing = () => {}, onSetStyle = () => {}, bsStyle = "primary", ...props} = {}) => (
    <DropdownButtonT id={props.idDropDown || uuidv1()} tooltip={props.tooltip} className="square-button-md" bsStyle={bsStyle} title={<Glyphicon glyph={props.glyph}/>} disabled={!!props.disabled} noCaret onClick={() => {onStopDrawing(); }}>
        <MenuItem onClick={() => { onClick("MultiPoint"); onSetStyle(getStyle("MultiPoint", props.style && props.style.MultiPoint || {})); }} eventKey="1"><Glyphicon glyph="point"/>&nbsp; Marker</MenuItem>
        <MenuItem onClick={() => { onClick("MultiLineString"); onSetStyle(getStyle("MultiLineString", props.style && props.style.MultiLineString || {})); }} eventKey="2"><Glyphicon glyph="line"/>&nbsp; Line</MenuItem>
        <MenuItem onClick={() => { onClick("MultiPolygon"); onSetStyle(getStyle("MultiPolygon", props.style && props.style.MultiPolygon || {})); }} eventKey="3"><Glyphicon glyph="polygon"/>&nbsp; Polygon</MenuItem>
    </DropdownButtonT>
);

module.exports = DropdownFeatureType;
