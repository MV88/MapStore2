/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const uuidv1 = require('uuid/v1');
const LocaleUtils = require('./LocaleUtils');
const {extraMarkers} = require('./MarkerUtils');
const {isCompletePolygon} = require('./DrawSupportUtils');
const {set} = require('./ImmutableUtils');
const {values, isNil, slice, head} = require('lodash');
const uuid = require('uuid');


const STYLE_CIRCLE = {
    color: '#ffcc33',
    opacity: 1,
    weight: 3,
    fillColor: '#ffffff',
    fillOpacity: 0.2,
    radius: 10
};
const STYLE_POINT = {
    iconGlyph: 'comment',
    iconShape: 'square',
    iconColor: 'blue'
};
const STYLE_TEXT = {
    fontStyle: 'normal',
    fontSize: '14',
    fontSizeUom: 'px',
    fontFamily: 'FontAwesome',
    fontWeight: 'normal',
    font: "14px FontAwesome",
    textAlign: 'center',
    color: '#000000',
    opacity: 1
};
const STYLE_LINE = {
    color: '#ffcc33',
    opacity: 1,
    weight: 3,
    fillColor: '#ffffff',
    fillOpacity: 0.2,
    editing: {
        fill: 1
    }
};
const STYLE_POLYGON = {
    color: '#ffcc33',
    opacity: 1,
    weight: 3,
    fillColor: '#ffffff',
    fillOpacity: 0.2,
    editing: {
        fill: 1
    }
};
const DEFAULT_ANNOTATIONS_STYLES = {
    "Text": STYLE_TEXT,
    "Point": STYLE_POINT,
    "Circle": STYLE_CIRCLE,
    "MultiPoint": STYLE_POINT,
    "LineString": STYLE_LINE,
    "MultiLineString": STYLE_LINE,
    "Polygon": STYLE_POLYGON,
    "MultiPolygon": STYLE_POLYGON
};


const rgbaTorgb = (rgba = "") => {
    return rgba.indexOf("rgba") !== -1 ? `rgb${rgba.slice(rgba.indexOf("("), rgba.lastIndexOf(","))})` : rgba;
};

const textAlignTolabelAlign = (a) => (a === "start" && "lm") || (a === "end" && "rm") || "cm";

const getStylesObject = ({type = "Point", features = []} = {}) => {
    return type === "FeatureCollection" ? features.reduce((p, {type: t}) => {
        p[t] = DEFAULT_ANNOTATIONS_STYLES[t];
        return p;
    }, {type: "FeatureCollection"}) : {...DEFAULT_ANNOTATIONS_STYLES[type]};
};
const getProperties = (props = {}, messages = {}) => ({title: LocaleUtils.getMessageById(messages, "annotations.defaulttitle") || "Default title", id: uuidv1(), ...props});

const annStyleToOlStyle = (type, style, label = "") => {
    const s = style[type] || style;
    switch (type) {
        case "MultiPolygon":
        case "Polygon":
        case "Circle":
            return {
                "strokeColor": rgbaTorgb(s.color),
                "strokeOpacity": s.opacity,
                "strokeWidth": s.weight,
                "fillColor": rgbaTorgb(s.fillColor),
                "fillOpacity": s.fillOpacity
            };
        case "LineString":
        case "MultiLineString":
            return {
                "strokeColor": rgbaTorgb(s.color),
                "strokeOpacity": s.opacity,
                "strokeWidth": s.weight
            };
        case "Text":
            return {
                "fontStyle": s.fontStyle,
                "fontSize": s.fontSize,   // in mapfish is in px
                "fontFamily": s.fontFamily,
                "fontWeight": s.fontWeight,
                "labelAlign": textAlignTolabelAlign(s.textAlign),
                "fontColor": rgbaTorgb(s.color),
                "fontOpacity": s.opacity,
                "label": label,
                "fill": false,
                "stroke": false
            };
        case "Point":
        case "MultiPoint": {
            const externalGraphic = extraMarkers.markerToDataUrl(s);
            return externalGraphic ? {
                    externalGraphic: externalGraphic,
                    "graphicWidth": 36,
                    "graphicHeight": 46,
                    "graphicXOffset": -18,
                    "graphicYOffset": -46
                } : {
                    "fillColor": "#0000AE",
                    "fillOpacity": 0.5,
                    "strokeColor": "#0000FF",
                    "pointRadius": 10,
                    "strokeOpacity": 1,
                    "strokeWidth": 1
            };
        }
        default:
            return {
                "fillColor": "#FF0000",
                "fillOpacity": 0,
                "strokeColor": "#FF0000",
                "pointRadius": 5,
                "strokeOpacity": 1,
                "strokeWidth": 1
            };
    }
};

const AnnotationsUtils = {
    /**
     * function used to convert a geojson into a internal model.
     * if it finds some textValues in the properties it will return this as Text
     * otherwise it will return the original geometry type.
     * @return {object} a transformed geojson with only geometry types
    */
    convertGeoJSONToInternalModel: ({type = "Point", geometries = [], features = []}, textValues = [], circles = []) => {
        switch (type) {
            case "Point": case "MultiPoint": {
                return {type: textValues.length === 1 ? "Text" : type};
            }
            case "Polygon": {
                return {type: circles.length === 1 ? "Circle" : type};
            }
            case "GeometryCollection": {
                const onlyPoints = geometries.filter(g => g.type === "Point" || g.type === "MultiPoint");
                const onlyMultiPolygons = geometries.filter(g => g.type === "Polygon");
                let t = 0;
                let p = 0;
                return {type: "GeometryCollection", geometries: geometries.map(g => {
                    if (g.type === "Point" || g.type === "MultiPoint") {
                        if (onlyPoints.length === textValues.length) {
                            return {type: "Text"};
                        }
                        if (textValues.length === 0) {
                            return {type: g.type};
                        }
                        if (t === 0) {
                            t++;
                            return {type: "Text" };
                        }
                    }
                    if (g.type === "Polygon") {
                        if (onlyMultiPolygons.length === circles.length) {
                            return {type: "Circle"};
                        }
                        if (circles.length === 0) {
                            return {type: g.type};
                        }
                        if (p === 0) {
                            p++;
                            return {type: "Circle" };
                        }
                    }
                    return {type: g.type};
                })};
            }
            case "FeatureCollection" : {
                const featuresTypes = features.map(f => {
                    if (f.properties && f.properties.isCircle) {
                        return {type: "Circle"};
                    }
                    if (f.properties && f.properties.isText) {
                        return {type: "Text"};
                    }
                    return {type: f.geometry.type};
                });
                return {type: "FeatureCollection", features: featuresTypes};
            }
            default: return {type};
        }
    },
    /**
     * Retrieves a non duplicated list of stylers
     * @return {string[]} it returns the array of available styler from geometry of a feature
    */
    getAvailableStyler: ({type = "Point", geometries = [], features = []} = {}) => {
        switch (type) {
            case "Point": case "MultiPoint": {
                return [AnnotationsUtils.getRelativeStyler(type)];
            }
            case "LineString": case "MultiLineString": {
                return [AnnotationsUtils.getRelativeStyler(type)];
            }
            case "Polygon": case "MultiPolygon": {
                return [AnnotationsUtils.getRelativeStyler(type)];
            }
            case "Text": {
                return [AnnotationsUtils.getRelativeStyler(type)];
            }
            case "Circle": {
                return [AnnotationsUtils.getRelativeStyler(type)];
            }
            case "GeometryCollection": {
                return geometries.reduce((p, c) => {
                    return (p.indexOf(AnnotationsUtils.getRelativeStyler(c.type)) !== -1) ? p : p.concat(AnnotationsUtils.getAvailableStyler(c));
                }, []);
            }
            case "FeatureCollection": {
                return features.reduce((p, c) => {
                    return (p.indexOf(AnnotationsUtils.getRelativeStyler(c.type)) !== -1) ? p : p.concat(AnnotationsUtils.getAvailableStyler(c));
                }, []);
            }
            default: return [];
        }
    },
    /**
     * it converts a geometryType to a stylertype
     * @return {string} a stylertype
    */
    getRelativeStyler: (type) => {
        switch (type) {
            case "Point": case "MultiPoint": {
                return "marker";
            }
            case "Circle": {
                return "circle";
            }
            case "LineString": case "MultiLineString": {
                return "lineString";
            }
            case "Polygon": case "MultiPolygon": {
                return "polygon";
            }
            case "Text": {
                return "text";
            }
            default: return "";
        }
    },
    /**
     * it converts some props of a CSS-font into a shorhand form
     * @return {string} a CSS-font
    */
    createFont: ({fontSize = "14", fontSizeUom = "px", fontFamily = "FontAwesome", fontStyle = "normal", fontWeight = "normal"} = {}) => {
        return `${fontStyle} ${fontWeight} ${fontSize}${fontSizeUom} ${fontFamily}`;
    },
    /**
     * some defaults for the style
    */
    DEFAULT_ANNOTATIONS_STYLES,
    STYLE_CIRCLE,
    STYLE_POINT,
    STYLE_TEXT,
    STYLE_LINE,
    STYLE_POLYGON,
    /**
    * it converts any geoJSONObject to an annotation
    * Mandatory elements: MUST be a geoJSON type Feature => properties with an ID and a title
    * annotation style.
    */
    normalizeAnnotation: (ann = {}, messages = {}) => {
        const annotation = ann.type !== "Feature" && {type: "Feature", geometry: ann} || {...ann};
        const style = getStylesObject(annotation.geometry);
        const properties = getProperties(annotation.properties, messages);
        return {style, properties, ...annotation};
    },
    removeDuplicate: (annotations) => values(annotations.reduce((p, c) => ({...p, [c.properties.id]: c}), {})),
    /**
    * Compress circle in a single MultyPolygon feature with style
    * @param (Object) geometry
    * @param (Object) properties
    * @param (Object) style
    * @return (OBject) feature
    */
    circlesToMultiPolygon: ({geometries}, {circles}, style = STYLE_CIRCLE) => {
        const coordinates = circles.reduce((coords, cIdx) => coords.concat([geometries[cIdx].coordinates]), []);
        return {type: "Feature", geometry: {type: "MultiPolygon", coordinates}, properties: {id: uuidv1(), ms_style: annStyleToOlStyle("Circle", style)}};
    },
    /**
    * Flatten text point to single point with style
    * @param (Object) geometry
    * @param (Object) properties
    * @param (Object) style
    * @return (array) features
    */
    textToPoint: ({geometries}, {textGeometriesIndexes, textValues}, style = STYLE_TEXT) => {
        return textGeometriesIndexes.map((tIdx, cIdx) => {
            return {type: "Feature", geometry: geometries[tIdx], properties: {id: uuidv1(), ms_style: annStyleToOlStyle("Text", style, textValues[cIdx])}};
        });

    },
    /**
    * Flatten geometry collection
    * @param (Object) GeometryCollection An annotation of type geometrycollection
    * @return (array) an array of features
    */
    flattenGeometryCollection: ({geometry, properties, style}) => {
        const circles = properties.circles && AnnotationsUtils.circlesToMultiPolygon(geometry, properties, style.Circle) || [];
        const texts = properties.textGeometriesIndexes && AnnotationsUtils.textToPoint(geometry, properties, style.Text) || [];
        const skeep = (properties.circles || []).concat(properties.textGeometriesIndexes || []);
        const features = geometry.geometries.filter((el, idx) => skeep.indexOf(idx) === -1)
            .map((geom) => ({
                type: "Feature",
                geometry: geom,
                properties: {id: uuidv1(), ms_style: annStyleToOlStyle(geom.type, style[geom.type])}
            }));
        return features.concat(circles, texts);
    },
    /**
    * Adapt annotation features to print pdf
    * @param (Array) features
    * @param (Object) style
    * @return (Array) features
    */
    annotationsToPrint: (features = []) => {
        return features.reduce((coll, f) => {
            return f.geometry.type === "GeometryCollection" && coll.concat(AnnotationsUtils.flattenGeometryCollection(f)) || coll.concat({type: "Feature", geometry: f.geometry, properties: {...f.properties, ms_style: annStyleToOlStyle(f.geometry.type, f.style)}});
        }, []);
    },
    formatCoordinates: (coords = [[]]) => {
        return coords.map(c => ({lat: c && c[1], lon: c && c[0]}));
    },
    getComponents: ({type, coordinates}) => {
        switch (type) {
            case "Polygon": {
                return isCompletePolygon(coordinates) ? AnnotationsUtils.formatCoordinates(slice(coordinates[0], 0, coordinates[0].length - 1)) : AnnotationsUtils.formatCoordinates(coordinates[0]);
            }
            case "LineString": {
                return AnnotationsUtils.formatCoordinates(coordinates);
            }
            default: return AnnotationsUtils.formatCoordinates([coordinates]);
        }
    },
    addIds: (features) => {
        return features.map(f => {
            if (f.properties && f.properties.id) {
                return f;
            }
            return set("properties.id", uuid.v1(), f);
        });
    },
    COMPONENTS_VALIDATION: {
        "Point": {min: 1, add: false, remove: false, validation: "validateCoordinates", notValid: "Add a valid coordinate to complete the Point"},
        "Polygon": {min: 3, add: true, remove: true, validation: "validateCoordinates", notValid: "Add 3 valid coordinates to complete the Polygon"},
        "LineString": {min: 2, add: true, remove: true, validation: "validateCoordinates", notValid: "Add 2 valid coordinates to complete the Polyline"},
        "Circle": {add: false, remove: false, validation: "validateCircle", notValid: "Add a valid coordinate and a radius (m) to complete the Circle"},
        "Text": {add: false, remove: false, validation: "validateText", notValid: "Add a valid coordinate and a Text value"}
    },
    validateCoords: ({lat, lon} = {}) => !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon)),
    validateCoordsArray: ([lon, lat] = []) => !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon)),
    validateCoord: (c) => !isNaN(parseFloat(c)),
    coordToArray: (c = {}) => [c.lon, c.lat],
    validateCoordinates: ({components = [], remove = false, type, isArray = false } = {}) => {
        if (components && components.length) {
            const validComponents = components.filter(AnnotationsUtils[isArray ? "validateCoordsArray" : "validateCoords"]);

            if (remove) {
                return validComponents.length > AnnotationsUtils.COMPONENTS_VALIDATION[type].min && validComponents.length === components.length;
            }
            return validComponents.length >= AnnotationsUtils.COMPONENTS_VALIDATION[type].min && validComponents.length === components.length;
        }
        return false;
    },
    validateCircle: ({components = [], properties = {radius: 0}, isArray = false} = {}) => {
        if (components && components.length) {
            const cmp = head(components);
            return !isNaN(parseFloat(properties.radius)) && (isArray ? AnnotationsUtils.validateCoordsArray(cmp) : AnnotationsUtils.validateCoords(cmp));
        }
        return false;
    },
    validateText: ({components = [], properties = {valueText: ""}, isArray = false} = {}) => {
        if (components && components.length) {
            const cmp = head(components);
            return properties && !!properties.valueText && (isArray ? AnnotationsUtils.validateCoordsArray(cmp) : AnnotationsUtils.validateCoords(cmp));
        }
        return false;
    },
    validateFeature: ({components = [[]], type, remove = false, properties = {}, isArray = false} = {}) => {
        if (isNil(type)) {
            return false;
        }
        if (type === "Text") {
            return AnnotationsUtils.validateText({components, properties, isArray});
        }
        if (type === "Circle") {
            return AnnotationsUtils.validateCircle({components, properties, isArray});
        }
        return AnnotationsUtils.validateCoordinates({components, remove, type, isArray});
    },
    getBaseCoord: (type) => {
        switch (type) {
            case "Polygon": case "LineString": return [];
            default: return [[]];
        }
    }
};

module.exports = AnnotationsUtils;
