const Icons = require('../../../utils/openlayers/Icons');
const {isNil, trim, isString} = require('lodash');
const {colorToRgbaStr} = require('../../../utils/ColorUtils');
const {isMarkerStyle, isTextStyle, isStrokeStyle, isFillStyle, isCircleStyle} = require('../../../utils/StyleUtils');
const ol = require('openlayers');

/**
    if a circle style is defined then return it
    available for ol.style.Image
*/
const getCircleStyle = (style = {}, stroke = null, fill = null) => {
    return isCircleStyle(style) ? new ol.style.Circle({
        stroke,
        fill,
        radius: style.radius || 5
    }) : null;
};

/**
    if a stroke style is defined then return it
*/
const getStrokeStyle = (style = {}) => {
    return isStrokeStyle(style) ? new ol.style.Stroke(style.stroke ? style.stroke : { // not sure about this ternary expr
        color: colorToRgbaStr(style.color || "#0000FF", style.opacity || 1),
        width: style.weight || 1,
        lineDash: isString(style.dashArray) && trim(style.dashArray).split(' ') || [6],
        lineCap: style.lineCap || 'round',
        lineJoin: style.lineJoin || 'round',
        lineDashOffset: style.dashOffset || 0
    }) : null;
};

/**
    if a fill style is defined then return it
*/
const getFillStyle = (style = {}) => {
    return isFillStyle(style) ? new ol.style.Fill(style.fill ? style.fill : { // not sure about this ternary expr
        color: colorToRgbaStr(style.fillColor || "#0000FF", style.fillOpacity || 1)
    }) : null;
};

/**
    if a text style is defined then return it
*/
const getTextStyle = (style = {}, stroke = null, fill = null, highlight = false) => {
    return isTextStyle(style) ? new ol.style.Text({
        fill,
        offsetY: style.offsetY || -( 4 * Math.sqrt(style.fontSize)), // TODO improve this for high font values > 100px
        textAlign: style.textAlign || "center",
        text: style.label || "",
        font: style.font || "Arial",
        // halo
        stroke: highlight ? new ol.style.Stroke({
            color: [255, 255, 255, 1],
            width: 2
        }) : stroke
        /*,
        // this should be another rule for the small circle
        image: highlight ?
            new ol.style.Circle({
                radius: 5,
                fill: null,
                stroke: new ol.style.Stroke({
                    color: colorToRgbaStr(style.color || "#0000FF", style.opacity || 1),
                    width: style.weight || 1
                })
            }) : null*/
    }) : null;
};

/**
    if a geom expression is present then return the corresponding function
*/
const getGeometryTrasformation = (style = {}) => {
    return style.geometry ?
    // then parse the geom_expression and return true or false
    () => {} : null;
};

const getFilter = (style = {}, {/*geometry, properties*/}) => {
    return style.filter ?
    // then parse the filter_expression and return true or false
    null : true; // if no fitler is defined, it returns true
};

function getMarkerStyle(options) {
    if (options.style.iconUrl) {
        return Icons.standard.getIcon(options);
    }
    const iconLibrary = options.style.iconLibrary || 'extra';
    if (Icons[iconLibrary]) {
        return Icons[iconLibrary].getIcon(options);
    }
    return null;
}

const parseStyleToOl = (style = {}, feature = {/*geometry, properties*/}) => {
    const filter = getFilter(style, feature);
    if (filter) {
        const stroke = getStrokeStyle(style);
        const fill = getFillStyle(style);
        const image = getCircleStyle;
        // const circle = new ol.style.Circle({});
        // const icon = new ol.style.Icon({});

        const text = getTextStyle(style, stroke, fill);
        const zIndex = style.zIndex;

     // if filter is defined and true (default value)
        const finalStyle = new ol.style.Style({
            geometry: getGeometryTrasformation(style),
            image,
            text,
            stroke: !text && !image && stroke || null,
            fill: !text && !image && fill || null,
            zIndex
        });
        return finalStyle;
    }
    // if not do not return anything

};


module.exports = {
    parseStyleToOl
};
