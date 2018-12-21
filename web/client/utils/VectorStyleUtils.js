/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {isNil} = require('lodash');
const {set} = require('./ImmutableUtils');

const isAttrPresent = (style = {}, attributes) => (attributes.filter(prop => !isNil(style[prop])).length > 0);

const isStrokeStyle = (style = {}, attributes = ["color", "opacity", "lineDash", "lineDashOffset", "lineCap", "lineJoin", "weight"]) => {
    return isAttrPresent(style, attributes);
};

const isFillStyle = (style = {}, attributes = ["fillColor", "fillOpacity"]) => {
    return isAttrPresent(style, attributes);
};

const isTextStyle = (style = {}, attributes = ["label", "font", "fontFamily", "fontSize", "fontStyle", "fontWeight", "textAlign" ]) => {
    return isAttrPresent(style, attributes);
};

const isCircleStyle = (style = {}, attributes = ["radius"]) => {
    return isAttrPresent(style, attributes);
};

const isMarkerStyle = (style = {}, attributes = ["iconGlyph", "iconShape"]) => {
    return isAttrPresent(style, attributes);
};

const isSymbolStyle = (style = {}, attributes = ["iconUrl"]) => {
    return isAttrPresent(style, attributes);
};

const getStylerTitle = (style = {}) => {
    if (isMarkerStyle(style)) {
        return "Marker";
    }
    if (isSymbolStyle(style)) {
        return "Symbol";
    }
    if (isTextStyle(style) ) {
        return "Text";
    }
    if (isCircleStyle(style) || style.title === "Circle Style") {
        return "Circle";
    }
    if (isFillStyle(style) ) {
        return "Polygon";
    }
    if (isStrokeStyle(style) ) {
        return "Polyline";
    }
};

let geometryFunctions = {};

const registerGeometryFunctions = (functionName, func) => {
    geometryFunctions[functionName] = func;
};

const addOpacityToColor = (color = "#FFCC33", opacity = 0.2) => (set("a", opacity, color));

module.exports = {
    registerGeometryFunctions,
    geometryFunctions,
    getStylerTitle,
    isAttrPresent,
    addOpacityToColor,
    isMarkerStyle,
    isSymbolStyle,
    isTextStyle,
    isCircleStyle,
    isStrokeStyle,
    isFillStyle
};
