/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';

import {insert, update, property, deleteFeature, transaction} from '../index';
import {fidFilter} from '../../../Filter/filter';
import {featureTypeSchema} from '../../../WFS/base';
import describeStates from '../../../../../test-resources/wfs/describe-states.json';
import describePois from '../../../../../test-resources/wfs/describe-pois.json';
import wyoming from '../../../../../test-resources/wfs/Wyoming.json';
import museam from '../../../../../test-resources/wfs/museam.json';
import expectedInsertWyoming from 'raw-loader!../../../../../test-resources/wfst/insert/Wyoming_1_1_0.xml';
import expectedInsertmuseam from 'raw-loader!../../../../../test-resources/wfst/insert/museam_1_1_0.xml';
import expectedDelete from 'raw-loader!../../../../../test-resources/wfst/delete/museam_1_1_0.xml';
import expectedUpdate from 'raw-loader!../../../../../test-resources/wfst/update/museam_1_1_0.xml';
describe('Test WFS-T request bodies generation', () => {
    it('WFS-T insert', () => {
        const result = insert(wyoming, describeStates);
        expect(result).toExist();
    });
    it('WFS-T transaction with insert polygon', () => {
        const result = transaction([insert(wyoming, describeStates)], featureTypeSchema(describeStates));
        expect(result).toExist();
        expect(result).toEqual(expectedInsertWyoming.replace(/[\r\n]/g, ''));
    });
    it('WFS-T transaction with insert multypolygon', () => {
        const result = transaction([insert(wyoming, describeStates)], featureTypeSchema(describeStates));
        expect(result).toExist();
        expect(result).toEqual(expectedInsertWyoming.replace(/[\n\r]/g, ''));
    });
    it('WFS-T transaction with insert point', () => {
        const result = transaction([insert(museam, describePois)], featureTypeSchema(describePois));
        expect(result).toExist();
        expect(result).toEqual(expectedInsertmuseam.replace(/[\n\r]/g, ''));
    });
    it('WFS-T transaction with delete', () => {
        const result = transaction([deleteFeature(museam, describePois)], featureTypeSchema(describePois));
        expect(result).toExist();
        expect(result).toEqual(expectedDelete.replace(/[\r\n]/g, ''));
    });
    it('WFS-T transaction with update', () => {
        const result = transaction(
            [update([property("NAME", "newName"), fidFilter("ogc", "poi.7")], describePois)
            ],
            featureTypeSchema(describePois));
        expect(result).toExist();
        expect(result).toEqual(expectedUpdate.replace(/[\r\n]/g, ''));
    });
});
