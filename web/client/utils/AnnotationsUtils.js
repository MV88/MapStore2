/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
const STYLE_POINT = {
    iconGlyph: 'comment',
    iconShape: 'square',
    iconColor: 'blue'
};
const STYLE_TEXT = {
    font: '14px FontAwesome',
    color: '#000000',
    weight: 1,
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
    "MultiPoint": STYLE_POINT,
    "LineString": STYLE_LINE,
    "MultiLineString": STYLE_LINE,
    "Polygon": STYLE_POLYGON,
    "MultiPolygon": STYLE_POLYGON
};
const AnnotationsUtils = {
    convertGeoJSONToInternalModel: ({type = "Point", geometries = []}, textValues = []) => {
        switch (type) {
            case "Point": case "MultiPoint": {
                return {type: textValues.length === 1 ? "Text" : type};
            }
            case "GeometryCollection": {
                const onlyPoints = geometries.filter(g => g.type === "Point" || g.type === "MultiPoint");
                let tmp = 0;
                return {type: "GeometryCollection", geometries: geometries.map(g => {
                    if (g.type === "Point" || g.type === "MultiPoint") {
                        if (onlyPoints.length === textValues.length) {
                            return {type: "Text"};
                        }
                        if (textValues.length === 0) {
                            return {type: g.type};
                        }
                        if (tmp === 0) {
                            tmp++;
                            return {type: "Text" };
                        }
                    }
                    return {type: g.type};
                })};
            }
            default: return {type};
        }
    },
    /**
     * Retrieves a non duplicated list of stylers
     * @return {string[]} it returns the array of available styler from geometry of a feature
    */
    getAvailableStyler: ({type = "Point", geometries = []} = {}) => {
        switch (type) {
            case "Point": case "MultiPoint": {
                return ["marker"];
            }
            case "LineString": case "MultiLineString": {
                return ["lineString"];
            }
            case "Polygon": case "MultiPolygon": {
                return ["polygon"];
            }
            case "Text": {
                return ["text"];
            }
            case "GeometryCollection": {
                return geometries.reduce((p, c) => {
                    return (p.indexOf(AnnotationsUtils.getRelativeStyler(c.type)) !== -1) ? p : p.concat(AnnotationsUtils.getAvailableStyler(c));
                }, []);
            }
            default: return [];
        }
    },
    getRelativeStyler: (type) => {
        switch (type) {
            case "Point": case "MultiPoint": {
                return "marker";
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
    DEFAULT_ANNOTATIONS_STYLES,
    STYLE_POINT,
    STYLE_TEXT,
    STYLE_LINE,
    STYLE_POLYGON

};

module.exports = AnnotationsUtils;
