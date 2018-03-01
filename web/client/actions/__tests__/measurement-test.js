/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const expect = require('expect');
const {
    toggleMeasurement, CHANGE_MEASUREMENT_TOOL,
    changeMeasurementState, CHANGE_MEASUREMENT_STATE,
    changeUom, CHANGE_UOM,
    changeLengthFormula, CHANGE_FORMULA,
    changeGeometry, CHANGED_GEOMETRY,
    toggleShowLabel, TOGGLE_SHOW_LABEL
} = require('../measurement');
const feature = {type: "Feature", geometry: {
    coordinates: [],
    type: "LineString"
}};
const measureState = {
    len: 84321231.123,
    lengthFormula: "Vincenty",
    feature
};
describe('Test correctness of measurement actions', () => {

    it('Test toggleMeasurement action creator', () => {
        const retval = toggleMeasurement(measureState);
        expect(retval).toExist();
        expect(retval.type).toBe(CHANGE_MEASUREMENT_TOOL);
        expect(retval.lengthFormula).toBe("Vincenty");
    });

    it('Test toggleShowLabel action creator', () => {
        const retval = toggleShowLabel();
        expect(retval).toExist();
        expect(retval.type).toBe(TOGGLE_SHOW_LABEL);
    });

    it('Test changeMousePositionState action creator', () => {
        const [uom, value, previousUom] = ["m", 42, {
            length: {unit: 'km', label: 'km'},
            area: {unit: 'sqm', label: 'm²'}
        }];
        const retval = changeUom(uom, value, previousUom);
        expect(retval).toExist();
        expect(retval.type).toBe(CHANGE_UOM);
        expect(retval.uom).toBe("m");
        expect(retval.value).toBe(42);
        expect(retval.previousUom.length.label).toBe("km");
    });

    it('Test changeLengthFormula action creator', () => {
        const formula = "Haversine";
        const retval = changeLengthFormula(formula);
        expect(retval).toExist();
        expect(retval.type).toBe(CHANGE_FORMULA);
        expect(retval.formula).toBe(formula);
    });

    it('Test changeGeometry action creator', () => {

        const retval = changeGeometry(feature);
        expect(retval).toExist();
        expect(retval.type).toBe(CHANGED_GEOMETRY);
        expect(retval.feature.geometry.type).toBe("LineString");
    });
    it('Test changeMeasurementState action creator', () => {
        const retval = changeMeasurementState(measureState);
        expect(retval).toExist();
        expect(retval.type).toBe(CHANGE_MEASUREMENT_STATE);
        expect(retval.feature.geometry.type).toBe("LineString");
    });

});
