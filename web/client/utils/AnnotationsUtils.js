/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

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
    }

};

module.exports = AnnotationsUtils;
