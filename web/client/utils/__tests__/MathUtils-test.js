/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
import expect from 'expect';
import {
    randomFloat,
    randomInt
} from '../MathUtils';

describe('Test MathUtils', () => {
    it('randomInt', () => {
        const result = randomInt();
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(123456789);
        expect(typeof result).toBe("number");
    });
    it('randomFloat', () => {
        const result = randomFloat();
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(1);
        expect(typeof result).toBe("number");
    });
});
