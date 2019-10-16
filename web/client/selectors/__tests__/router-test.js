/*
* Copyright 2017, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import expect from 'expect';

import { pathnameSelector } from '../router';
const pathname = "/viewer/openlayers/123";
const state = {
    router: {
        location: {
            pathname
        }
    }
};

describe('Test router selectors', () => {
    it('test pathnameSelector', () => {
        const retVal = pathnameSelector(state);
        expect(retVal).toExist();
        expect(retVal).toBe(pathname);
    });
});
