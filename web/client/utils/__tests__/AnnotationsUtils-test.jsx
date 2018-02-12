/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
const expect = require('expect');

const {getAvailableStyler} = require('../AnnotationsUtils');

describe('Test the AnnotationsUtils', () => {
    it('getAvailableStyler for point or MultiPoint', () => {
        let stylers = getAvailableStyler({type: "Point"});
        expect(stylers.length).toBe(1);
        expect(stylers[0]).toBe("marker");

        stylers = getAvailableStyler({type: "MultiPoint"});
        expect(stylers.length).toBe(1);
        expect(stylers[0]).toBe("marker");

    });
    it('getAvailableStyler for LineString or MultiLineString', () => {
        let stylers = getAvailableStyler({type: "LineString"});
        expect(stylers.length).toBe(1);
        expect(stylers[0]).toBe("lineString");

        stylers = getAvailableStyler({type: "MultiLineString"});
        expect(stylers.length).toBe(1);
        expect(stylers[0]).toBe("lineString");

    });
    it('getAvailableStyler for Polygon or MultiPolygon', () => {
        let stylers = getAvailableStyler({type: "Polygon"});
        expect(stylers.length).toBe(1);
        expect(stylers[0]).toBe("polygon");

        stylers = getAvailableStyler({type: "MultiPolygon"});
        expect(stylers.length).toBe(1);
        expect(stylers[0]).toBe("polygon");

    });
    it('getAvailableStyler for GeometryCollection', () => {
        let stylers = getAvailableStyler({type: "GeometryCollection", geometries:
            [{type: "MultiPolygon"}, {type: "MultiPoint"}]});
        expect(stylers.length).toBe(2);
        expect(stylers[0]).toBe("polygon");
        expect(stylers[1]).toBe("marker");

        stylers = getAvailableStyler({type: "GeometryCollection", geometries:
            [{type: "MultiLineString"}, {type: "MultiPoint"}, {type: "MultiPolygon"}]});
        expect(stylers.length).toBe(3);
        expect(stylers[0]).toBe("lineString");
        expect(stylers[1]).toBe("marker");
        expect(stylers[2]).toBe("polygon");

    });
});
