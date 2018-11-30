/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {isNil} = require('lodash');

module.exports = (mapType) => {

    const isStrokeStyle = (style = {}) => {
        const strokeStyles = ["color", "opacity", "lineDash", "lineDashOffset", "lineCap", "lineJoin", "weight"];
        return strokeStyles.filter(prop => !isNil(style[prop])).length !== -1;
    };
    const isFillStyle = (style = {}) => {
        const fillStyles = ["fillColor", "fillOpacity"];
        return fillStyles.filter(prop => !isNil(style[prop])).length !== -1;
    };

    const isTextStyle = (style = {}) => {
        const textStyles = ["label", "font", "fontFamily", "fontSize", "fontStyle", "fontWeight", "textAlign" ];
        return textStyles.filter(prop => !isNil(style[prop])).length !== -1;
    };

    const isCircleStyle = (style = {}) => {
        const circleStyles = ["radius"];
        return circleStyles.filter(prop => !isNil(style[prop])).length !== -1;
    };
    const isMarkerStyle = (style = {}) => {
        const markerStyles = ["iconUrl", "iconGlyph"];
        return markerStyles.filter(prop => !isNil(style[prop])).length !== -1;
    };

    return {
        isMarkerStyle,
        isTextStyle,
        isCircleStyle,
        isStrokeStyle,
        isFillStyle,
        toVectorStyle: require('./' + mapType + '/StyleUtils')
    };
};
