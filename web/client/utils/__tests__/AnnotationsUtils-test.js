/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
const expect = require('expect');

const {getAvailableStyler, getRelativeStyler, convertGeoJSONToInternalModel, DEFAULT_ANNOTATIONS_STYLES, createFont,
    normalizeAnnotation, removeDuplicate, formatCoordinates, isCompletePolygon, getComponents, addIds, validateCoords,
    validateCoordsArray, validateCoord, getBaseCoord, validateText
} = require('../AnnotationsUtils');

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
    it('getRelativeStyler for simple Geoms and Text', () => {
        let styler = getRelativeStyler("Polygon");
        expect(styler).toBe("polygon");
        styler = getRelativeStyler("MultiPolygon");
        expect(styler).toBe("polygon");

        styler = getRelativeStyler("MultiPoint");
        expect(styler).toBe("marker");
        styler = getRelativeStyler("Point");
        expect(styler).toBe("marker");

        styler = getRelativeStyler("MultiLineString");
        expect(styler).toBe("lineString");
        styler = getRelativeStyler("LineString");
        expect(styler).toBe("lineString");

        styler = getRelativeStyler("Text");
        expect(styler).toBe("text");
    });
    it('default styles text', () => {
        const numStyles = Object.keys(DEFAULT_ANNOTATIONS_STYLES);
        expect(numStyles.length).toBe(8);

        const textParams = Object.keys(DEFAULT_ANNOTATIONS_STYLES.Text);
        expect(textParams.length).toBe(9);

        const {font, color, opacity, fontStyle, fontSize, fontSizeUom, textAlign, fontFamily, fontWeight} = DEFAULT_ANNOTATIONS_STYLES.Text;
        expect(font).toBe("14px FontAwesome");
        expect(color).toBe("#000000");
        expect(fontStyle).toBe("normal");
        expect(fontWeight).toBe("normal");
        expect(fontSize).toBe("14");
        expect(fontFamily).toBe("FontAwesome");
        expect(fontSizeUom).toBe("px");
        expect(textAlign).toBe("center");
        expect(opacity).toBe(1);
    });
    it('default styles Point', () => {
        let {iconGlyph, iconShape, iconColor} = DEFAULT_ANNOTATIONS_STYLES.Point;
        expect(iconGlyph).toBe("comment");
        expect(iconShape).toBe("square");
        expect(iconColor).toBe("blue");
    });
    it('default styles MultiPoint', () => {
        let {iconGlyph, iconShape, iconColor} = DEFAULT_ANNOTATIONS_STYLES.MultiPoint;
        expect(iconGlyph).toBe("comment");
        expect(iconShape).toBe("square");
        expect(iconColor).toBe("blue");
    });
    it('default styles LineString', () => {
        let {color, opacity, weight, fillColor, fillOpacity} = DEFAULT_ANNOTATIONS_STYLES.LineString;
        expect(color).toBe("#ffcc33");
        expect(opacity).toBe(1);
        expect(weight).toBe(3);
        expect(fillColor).toBe("#ffffff");
        expect(fillOpacity).toBe(0.2);
    });
    it('default styles Circle', () => {
        let {color, opacity, weight, fillColor, fillOpacity, radius} = DEFAULT_ANNOTATIONS_STYLES.Circle;
        expect(color).toBe("#ffcc33");
        expect(opacity).toBe(1);
        expect(weight).toBe(3);
        expect(radius).toBe(10);
        expect(fillColor).toBe("#ffffff");
        expect(fillOpacity).toBe(0.2);
    });
    it('default styles MultiLineString', () => {
        let {color, opacity, weight, fillColor, fillOpacity} = DEFAULT_ANNOTATIONS_STYLES.MultiLineString;
        expect(color).toBe("#ffcc33");
        expect(opacity).toBe(1);
        expect(weight).toBe(3);
        expect(fillColor).toBe("#ffffff");
        expect(fillOpacity).toBe(0.2);
    });
    it('default styles Polygon', () => {
        let {color, opacity, weight, fillColor, fillOpacity} = DEFAULT_ANNOTATIONS_STYLES.Polygon;
        expect(color).toBe("#ffcc33");
        expect(opacity).toBe(1);
        expect(weight).toBe(3);
        expect(fillColor).toBe("#ffffff");
        expect(fillOpacity).toBe(0.2);
    });
    it('default styles MultiPolygon', () => {
        let {color, opacity, weight, fillColor, fillOpacity} = DEFAULT_ANNOTATIONS_STYLES.MultiPolygon;
        expect(color).toBe("#ffcc33");
        expect(opacity).toBe(1);
        expect(weight).toBe(3);
        expect(fillColor).toBe("#ffffff");
        expect(fillOpacity).toBe(0.2);
    });
    it('convertGeoJSONToInternalModel simple geoms', () => {
        let newGeom = convertGeoJSONToInternalModel({type: "MultiPoint"}, []);
        expect(newGeom.type).toBe("MultiPoint");
        newGeom = convertGeoJSONToInternalModel({type: "MultiPoint"}, ["someval"]);
        expect(newGeom.type).toBe("Text");
        newGeom = convertGeoJSONToInternalModel({type: "MultiLineString"}, []);
        expect(newGeom.type).toBe("MultiLineString");
        newGeom = convertGeoJSONToInternalModel({type: "LineString"}, []);
        expect(newGeom.type).toBe("LineString");
        newGeom = convertGeoJSONToInternalModel({type: "MultiPolygon"}, []);
        expect(newGeom.type).toBe("MultiPolygon");
        newGeom = convertGeoJSONToInternalModel({type: "Polygon"}, []);
        expect(newGeom.type).toBe("Polygon");
    });
    it('convertGeoJSONToInternalModel multi geoms', () => {
        let geometries = [{type: "MultiPolygon"}, {type: "MultiPoint"}];
        let newGeom = convertGeoJSONToInternalModel({type: "GeometryCollection", geometries}, []);
        newGeom.geometries.forEach((g, i) => {
            expect(g.type).toBe(geometries[i].type);
        });
        geometries = [{type: "MultiPolygon"}, {type: "MultiPoint"}];

        let convertedGeometries = [{type: "MultiPolygon"}, {type: "Text"}];
        newGeom = convertGeoJSONToInternalModel({type: "GeometryCollection", geometries}, ["some va"]);
        newGeom.geometries.forEach((g, i) => {
            expect(g.type).toBe(convertedGeometries[i].type);
        });
        geometries = [{type: "MultiPoint"}, {type: "MultiPoint"}];
        convertedGeometries = [{type: "Text"}, {type: "MultiPoint"}];
        newGeom = convertGeoJSONToInternalModel({type: "GeometryCollection", geometries}, ["some va"]);
        newGeom.geometries.forEach((g, i) => {
            expect(g.type).toBe(convertedGeometries[i].type);
        });
        geometries = [{type: "Polygon"}, {type: "MultiPoint"}];
        convertedGeometries = [{type: "Circle"}, {type: "MultiPoint"}];
        newGeom = convertGeoJSONToInternalModel({type: "GeometryCollection", geometries}, [], ["some va"]);
        newGeom.geometries.forEach((g, i) => {
            expect(g.type).toBe(convertedGeometries[i].type);
        });
        geometries = [{type: "MultiPoint"}, {type: "MultiLineString"}, {type: "MultiPoint"}];
        convertedGeometries = [{type: "Text"}, {type: "MultiLineString"}, {type: "MultiPoint"}];
        newGeom = convertGeoJSONToInternalModel({type: "GeometryCollection", geometries}, ["some va"]);
        newGeom.geometries.forEach((g, i) => {
            expect(g.type).toBe(convertedGeometries[i].type);
        });
    });
    it('create font with values', () => {
        // with defaults
        expect(createFont({})).toBe("normal normal 14px FontAwesome");

        // with values
        expect(createFont({fontFamily: "Courier"})).toBe("normal normal 14px Courier");
        expect(createFont({fontSize: "30"})).toBe("normal normal 30px FontAwesome");
        expect(createFont({fontSizeUom: "em"})).toBe("normal normal 14em FontAwesome");
        expect(createFont({fontStyle: "italic"})).toBe("italic normal 14px FontAwesome");
        expect(createFont({fontWeight: "bold"})).toBe("normal bold 14px FontAwesome");
    });

    it('test normalizeAnnotation defaults', () => {
        let annotation = normalizeAnnotation();
        expect(annotation.geometry.coordinates).toBe(undefined);
        expect(annotation.geometry.type).toBe(undefined);
        expect(annotation.properties.title).toBe("Default title");
    });
/*
    it('test normalizeAnnotation with Annotation', () => {
        const ann = {
            type: "Feature",
            geometry
        }
        let annotationNormalized = normalizeAnnotation();
        expect(annotationNormalized.geometry.coordinates).toBe(undefined);
        expect(annotationNormalized.geometry.type).toBe(undefined);
        expect(annotationNormalized.properties.title).toBe("Default title");
    });*/
    it('test removeDuplicate', () => {
        const annotations = [{properties: {id: "id1"}}, {properties: {id: "id2"}}, {properties: {id: "id2"}}];
        expect(removeDuplicate(annotations).length).toBe(2);
    });
    it('test formatCoordinates defaults and with data', () => {
        expect(formatCoordinates().length).toBe(1);
        expect(formatCoordinates()[0].lon).toBe(undefined);
        expect(formatCoordinates()[0].lat).toBe(undefined);

        const coords = [[1, 2], [3, 4]];
        expect(formatCoordinates(coords).length).toBe(2);
        expect(formatCoordinates(coords)[0].lon).toBe(1);
        expect(formatCoordinates(coords)[0].lat).toBe(2);

        const coords2 = [[1, undefined]];
        expect(formatCoordinates(coords2).length).toBe(1);
        expect(formatCoordinates(coords2)[0].lon).toBe(1);
        expect(formatCoordinates(coords2)[0].lat).toBe(undefined);
    });
    it('test isCompletePolygon defaults', () => {
        const polygonCoords1 = [[[1, 1], [2, 2]]];
        const polygonCoords2 = [[[1, 1], [2, 2], [1, 1]]];
        const polygonCoords3 = [[[1, 1], [2, 2], [3, 3], [1, 1]]];
        const polygonCoords4 = [[[1, 1], [2, undefined], [3, 3], [1, 1]]];
        expect(isCompletePolygon()).toBe(false);
        expect(isCompletePolygon(polygonCoords1)).toBe(false);
        expect(isCompletePolygon(polygonCoords2)).toBe(false);
        expect(isCompletePolygon(polygonCoords3)).toBe(true);
        expect(isCompletePolygon(polygonCoords4)).toBe(false);
    });
    it('test getComponents defaults', () => {
        const polygonCoords3 = [[[1, 1], [2, 2], [3, 3], [1, 1]]];

        let polygonGeom = {
            type: "Polygon",
            coordinates: polygonCoords3
        };
        expect(getComponents(polygonGeom).length).toBe(3);

        const polygonCoords2 = [[[1, 1], [2, undefined], [3, 3]]];
        let polygonGeom2 = {
            type: "Polygon",
            coordinates: polygonCoords2
        };
        expect(getComponents(polygonGeom2).length).toBe(3);

        let lineString = {
            type: "LineString",
            coordinates: polygonCoords2[0]
        };
        expect(getComponents(lineString).length).toBe(3);

        let point = {
            type: "Point",
            coordinates: polygonCoords2[0][0]
        };
        expect(getComponents(point).length).toBe(1);
        expect(getComponents(point)[0].lon).toBe(1);
        expect(getComponents(point)[0].lat).toBe(1);
    });

    it('test addIds defaults', () => {
        const features = [{properties: {id: "some id"}}, {properties: {}}];
        expect(addIds(features).length).toBe(2);
        expect(addIds(features).map(f => f.properties.id)[0]).toBe("some id");
    });
    it('test validateCoords ', () => {
        expect(validateCoords({lat: undefined, lon: 2})).toBe(false);
        expect(validateCoords({lat: 4, lon: 2})).toBe(true);
    });
    it('test validateCoordsArray', () => {
        expect(validateCoordsArray([undefined, 2])).toBe(false);
        expect(validateCoordsArray([4, 2])).toBe(true);
    });
    it('test validateCoord', () => {
        expect(validateCoord(undefined)).toBe(false);
        expect(validateCoord(2)).toBe(true);
    });
    it('test getBaseCoord defaults', () => {
        expect(getBaseCoord().length).toBe(1);
        expect(getBaseCoord()[0].length).toBe(0);
        expect(getBaseCoord("Polygon").length).toBe(0);
        expect(getBaseCoord("LineString").length).toBe(0);
    });
    it('test validateText defaults', () => {
        let components = [[1, 2]];
        let textAnnot = {
            components,
            isArray: true,
            properties: {
                valueText: "valid"
            }
        };
        expect(validateText(textAnnot)).toBe(true);

        textAnnot.properties.valueText = "";
        expect(validateText(textAnnot)).toBe(false);

        textAnnot.properties.valueText = "asdgf";
        textAnnot.components = [undefined, 4];
        expect(validateText(textAnnot)).toBe(false);

        textAnnot.isArray = false;
        textAnnot.components = [{lat: 4, lon: 4}];
        expect(validateText(textAnnot)).toBe(true);

        textAnnot.components = [undefined, 4];
        expect(validateText(textAnnot)).toBe(false);
    });
    /*it('test normalizeAnnotation defaults', () => {
        expect(annotation.properties.title).toBe("Default Title");
    });*/
});
