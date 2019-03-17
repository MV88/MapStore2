/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const expect = require('expect');
const React = require('react');
const ReactDOM = require('react-dom');
const ol = require('openlayers');
const MeasurementSupport = require('../MeasurementSupport');

describe('Openlayers MeasurementSupport', () => {
    let msNode;

    /* basic objects */
    const viewOptions = {
        projection: 'EPSG:3857',
        center: [0, 0],
        zoom: 5
    };
    const map = new ol.Map({
        target: "map",
        view: new ol.View(viewOptions)
    });
    const lineFeature = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: [[0, 1], [2, 4]]
        },
        properties: {}
    };
    const lineFeature2 = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: [[1, 1], [55, 5]]
        },
        properties: {}
    };
    const invalidLineFeature = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: [[1, 1], [55, 5], ["", 5]]
        }
    };
    const polyFeature = {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [[[0, 1], [0, 5], [2, 1], [0, 1]]]
        },
        properties: {}
    };
    const invalidPolyFeature = {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [[[0, 1], [0, 5], [2, ""], [0, 1]]]
        },
        properties: {}
    };
    const measurementProp = {
        geomType: null
    };
    const uom = {
        length: {unit: 'm', label: 'm'},
        area: {unit: 'sqm', label: 'm²'}
    };
    function getMapLayersNum(olMap) {
        return olMap.getLayers().getLength();
    }
    /* utility used to render the MeasurementSupport component with some default props*/
    const renderMeasurement = (props = {}) => {
        return ReactDOM.render(
            <MeasurementSupport
                measurement={props.measurement || measurementProp}
                map={props.map || map}
                {...props}
            />, msNode);
    };

    const renderWithDrawing = () => {
        let cmp = renderMeasurement();
        cmp = renderMeasurement({
            measurement: {
                feature: {},
                geomType: "LineString"
            }
        });
        return cmp;
    };

    beforeEach((done) => {
        document.body.innerHTML = '<div id="map" style="heigth: 100px; width: 100px"></div><div id="ms"></div>';
        msNode = document.getElementById('ms');
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(msNode);
        document.body.innerHTML = '';
        msNode = undefined;
        setTimeout(done);
    });

    it('test creation', () => {
        const cmp = renderMeasurement();
        expect(cmp).toExist();
    });
    it('test if a new layer is added to the map in order to allow drawing.', () => {
        let cmp = renderMeasurement();
        expect(cmp).toExist();

        let initialLayersNum = getMapLayersNum(map);
        cmp = renderMeasurement({
            measurement: {
                geomType: "LineString",
                showLabel: true
            }
        });
        expect(getMapLayersNum(map)).toBeGreaterThan(initialLayersNum);
    });
    it('test if drawing layers will be removed', () => {
        let cmp = renderMeasurement();
        expect(cmp).toExist();

        let initialLayersNum = getMapLayersNum(map);
        cmp = renderMeasurement({
            measurement: {
                geomType: "Polygon"
            }
        });

        expect(getMapLayersNum(map)).toBeGreaterThan(initialLayersNum);
        cmp = renderMeasurement();
        expect(getMapLayersNum(map)).toBe(initialLayersNum);
    });
    it('test updating distance (LineString) tooltip after change uom', () => {
        let cmp = renderWithDrawing();
        expect(cmp).toExist();
        cmp = renderMeasurement({
            measurement: {
                geomType: "LineString",
                feature: lineFeature,
                lineMeasureEnabled: true,
                updatedByUI: true,
                showLabel: true
            },
            uom
        });
        cmp = renderMeasurement({
            measurement: {
                geomType: "LineString",
                feature: lineFeature2,
                lineMeasureEnabled: true,
                updatedByUI: true,
                showLabel: true
            },
            uom
        });

    });
    it('test updating Bearing (LineString) tooltip after change uom', () => {
        let cmp = renderWithDrawing();
        expect(cmp).toExist();
        cmp = renderMeasurement({
            measurement: {
                geomType: "Bearing",
                feature: lineFeature,
                bearingMeasureEnabled: true,
                updatedByUI: true,
                showLabel: true
            },
            uom
        });
        cmp = renderMeasurement({
            measurement: {
                geomType: "LineString",
                feature: lineFeature2,
                lineMeasureEnabled: true,
                updatedByUI: true,
                showLabel: true
            },
            uom
        });

    });
    it('test updating area (Polygon) tooltip after change uom', () => {
        let cmp = renderWithDrawing();
        expect(cmp).toExist();
        cmp = renderMeasurement({
            measurement: {
                geomType: "Polygon",
                feature: polyFeature,
                areaMeasureEnabled: true,
                updatedByUI: true,
                showLabel: false
            },
            uom
        });
    });
    it('test updating area (Polygon) with invalid tooltip after change uom', () => {
        let cmp = renderWithDrawing();
        expect(cmp).toExist();
        cmp = renderMeasurement({
            measurement: {
                geomType: "Polygon",
                feature: invalidPolyFeature,
                areaMeasureEnabled: true,
                updatedByUI: true,
                showLabel: false
            },
            uom
        });
    });
    it('test updating area (LineString) with invalid tooltip after change uom', () => {
        let cmp = renderWithDrawing();
        expect(cmp).toExist();
        cmp = renderMeasurement({
            measurement: {
                geomType: "LineString",
                feature: invalidLineFeature,
                lineMeasureEnabled: true,
                updatedByUI: true,
                showLabel: false
            },
            uom
        });
    });
    it('test drawing a distance (LineString) with invalid tooltip after change uom', () => {
        let cmp = renderWithDrawing();
        expect(cmp).toExist();
        cmp = renderMeasurement({
            measurement: {
                geomType: "LineString",
                feature: invalidLineFeature,
                lineMeasureEnabled: true,
                updatedByUI: true,
                showLabel: true
            },
            uom
        });
        cmp.drawInteraction.dispatchEvent({
            type: 'drawstart',
            feature: new ol.Feature({
                  geometry: new ol.geom.Point(13.0, 43.0),
                  name: 'My Point'
            })
        });
        cmp.drawInteraction.dispatchEvent({
            type: 'drawend',
            feature: new ol.Feature({
                  geometry: new ol.geom.Point(13.0, 43.0),
                  name: 'My Point'
            })
        });
    });
    it('test drawing a distance (LineString) and moving pointer', () => {
        let cmp = renderWithDrawing();
        expect(cmp).toExist();
        cmp = renderMeasurement({
            measurement: {
                geomType: "LineString",
                feature: lineFeature,
                lineMeasureEnabled: true,
                updatedByUI: true,
                showLabel: true
            },
            uom
        });
        cmp.drawInteraction.dispatchEvent({
            type: 'drawstart',
            feature: new ol.Feature({
                  geometry: new ol.geom.Point(1.0, 3.0),
                  name: 'My Point'
            })
        });
        map.dispatchEvent({
            type: 'pointermove',
            coordinate: [100, 400],
            feature: new ol.Feature({
                  geometry: new ol.geom.Point(13.0, 43.0),
                  name: 'My Point'
            })
        });
    });
});
