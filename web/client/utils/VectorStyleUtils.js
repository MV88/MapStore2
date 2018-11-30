/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {isNil} = require('lodash');

const isStrokeStyle = (style = {}) => {
    const strokeStyles = ["color", "opacity", "lineDash", "lineDashOffset", "lineCap", "lineJoin", "weight"];
    return strokeStyles.filter(prop => !isNil(style[prop])).length > 0;
};
const isFillStyle = (style = {}) => {
    const fillStyles = ["fillColor", "fillOpacity"];
    return fillStyles.filter(prop => !isNil(style[prop])).length > 0;
};

const isTextStyle = (style = {}) => {
    const textStyles = ["label", "font", "fontFamily", "fontSize", "fontStyle", "fontWeight", "textAlign" ];
    return textStyles.filter(prop => !isNil(style[prop])).length > 0;
};

const isCircleStyle = (style = {}) => {
    const circleStyles = ["radius"];
    return circleStyles.filter(prop => !isNil(style[prop])).length > 0;
};
const isMarkerStyle = (style = {}) => {
    const markerStyles = ["iconUrl", "iconGlyph"];
    return markerStyles.filter(prop => !isNil(style[prop])).length > 0;
};
module.exports = {
    isMarkerStyle,
    isTextStyle,
    isCircleStyle,
    isStrokeStyle,
    isFillStyle
};
