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
const STYLE_LINE = {
    color: '#ffcc33',
    opacity: 1,
    weight: 3,
    fillColor: '#ffffff',
    fillOpacity: 0.2,
    clickable: false,
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
    clickable: false,
    editing: {
        fill: 1
    }
};
const DEFAULT_ANNOTATIONS_STYLES = {
    "Point": STYLE_POINT,
    "MultiPoint": STYLE_POINT,
    "LineString": STYLE_LINE,
    "MultiLineString": STYLE_LINE,
    "Polygon": STYLE_POLYGON,
    "MultiPolygon": STYLE_POLYGON
};
const AnnotationsUtils = {
    /**
     * Retrieves a non duplicated list of stylers
     * @return {string[]} it returns the array of available styler from geometry of a feature
    */
    getAvailableStyler: ({type = "Point", geometries = {}} = {}) => {
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
            case "GeometryCollection": {
                return geometries.reduce((p, c) => {
                    return (p.indexOf(c.type) !== -1) ? p : p.concat(AnnotationsUtils.getAvailableStyler(c));
                }, []);
            }
            default: return ["marker"];
        }
    },
    DEFAULT_ANNOTATIONS_STYLES,
    STYLE_POINT,
    STYLE_LINE,
    STYLE_POLYGON

};

module.exports = AnnotationsUtils;
