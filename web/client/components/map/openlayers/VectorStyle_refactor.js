const {isNil, trim, isString, isArray, castArray, head, last} = require('lodash');
const {colorToRgbaStr} = require('../../../utils/ColorUtils');
const Icons = require('../../../utils/openlayers/Icons');

const selectedStyle = {
    white: [255, 255, 255, 1],
    blue: [0, 153, 255, 1],
    width: 3
};


const {
    isMarkerStyle, isTextStyle, isStrokeStyle, isFillStyle, isCircleStyle, isSymbolStyle,
    registerGeometryFunctions, geometryFunctions} = require('../../../utils/VectorStyleUtils');
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

const getMarkerStyle = (style) => {
    if (isMarkerStyle(style)) {
        if (style.iconUrl) {
            return Icons.standard.getIcon({style});
        }
        const iconLibrary = style.iconLibrary || 'extra';
        if (Icons[iconLibrary]) {
            return Icons[iconLibrary].getIcon({style});
        }
    }
    return null;
};

/**
    if a stroke style is defined then return it
*/
const getStrokeStyle = (style = {}, highlight) => {
    return isStrokeStyle(style) ? new ol.style.Stroke(style.stroke ? style.stroke : { // not sure about this ternary expr
        color: highlight ? selectedStyle.blue : colorToRgbaStr(style.color || "#0000FF", isNil(style.opacity) ? 1 : style.opacity),
        width: isNil(style.weight) ? 1 : style.weight,
        lineDash: isString(style.dashArray) && trim(style.dashArray).split(' ') || isArray(style.dashArray) && style.dashArray || [0],
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
const getTextStyle = (style = {}, stroke = null, fill = null, highlight = false, feature) => {
    return isTextStyle(style) ? new ol.style.Text({
        fill,
        offsetY: style.offsetY || -( 4 * Math.sqrt(style.fontSize)), // TODO improve this for high font values > 100px
        textAlign: style.textAlign || "center",
        text: style.label || feature.properties && feature.properties.valueText || "New",
        font: style.font || "Arial",
        // halo
        stroke: highlight ? new ol.style.Stroke({
            color: [255, 255, 255, 1],
            width: 2
        }) : stroke,
        // this should be another rule for the small circle
        image: highlight ?
            new ol.style.Circle({
                radius: 5,
                fill: null,
                stroke: new ol.style.Stroke({
                    color: colorToRgbaStr(style.color || "#0000FF", style.opacity || 1),
                    width: style.weight || 1
                })
            }) : null
    }) : null;
};

const centerPoint = (feature) => {
    const geometry = feature.getGeometry();
    const extent = geometry.getExtent();
    let center = geometry.getCenter && geometry.getCenter() || [extent[2] - extent[0], extent[3] - extent[1]];

    return new ol.geom.Point(center);
};
const startPoint = (feature) => {
    const geom = feature.getGeometry();
    const type = geom.getType();
    let coordinates = type === "Polygon" ? geom.getCoordinates()[0] : geom.getCoordinates();
    return coordinates.length > 1 ? new ol.geom.Point(head(coordinates)) : null;
};
const endPoint = (feature) => {
    const geom = feature.getGeometry();
    const type = geom.getType();

    let coordinates = type === "Polygon" ? geom.getCoordinates()[0] : geom.getCoordinates();
    return new ol.geom.Point(coordinates.length > 3 ? coordinates[coordinates.length - (type === "Polygon" ? 2 : 1)] : last(coordinates));
};

registerGeometryFunctions("centerPoint", centerPoint);
registerGeometryFunctions("startPoint", startPoint);
registerGeometryFunctions("endPoint", endPoint);

/**
    if a geom expression is present then return the corresponding function
*/
const getGeometryTrasformation = (style = {}) => {
    return style.geometry ?
    // then parse the geom_expression and return true or false
    (feature) => {
        const geomFunction = style.geometry || "centerPoint";
        return geometryFunctions[geomFunction](feature);
    } : (f) => f.getGeometry();
};

const getFilter = (style = {}, {/*geometry, properties*/}) => {
    return !isNil(style.filtering) ?
    // then parse the filter_expression and return true or false
    style.filtering : true; // if no filter is defined, it returns true
};


const parseStyleToOl = (feature = {}, style = {}, highlight = false) => {
    const filtering = getFilter(style, feature);
    if (filtering) {
        const stroke = getStrokeStyle(style, highlight);
        const fill = getFillStyle(style);
        const image = getCircleStyle(style);

        if (isMarkerStyle(style)) {
            return getMarkerStyle(style).map(s => {
                s.setGeometry(getGeometryTrasformation(style));
                return s;
            });
        }
        // TODO fix this
        if (isSymbolStyle(style)) {
            return Icons.standard.getIcon({style}).map(s => {
                s.setGeometry(getGeometryTrasformation(style));
                return s;
            });
        }
        const text = getTextStyle(style, stroke, fill, null, feature);
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
        return [finalStyle];
    }
    return new ol.style.Style({});
    // if not do not return anything

};

const parseStyles = (feature = {}, highlight) => {
    let styles = feature.style;
    let tempStyles = isArray(styles) ? styles : castArray(styles);
    return tempStyles.reduce((p, c) => {
        return p.concat(parseStyleToOl(feature, c, highlight));
    }, []);

};
module.exports = {
    parseStyleToOl,
    parseStyles,
    centerPoint
};
