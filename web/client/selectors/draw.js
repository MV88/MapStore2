/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { get } from 'lodash';

const changedGeometriesSelector = state => state && state.draw && state.draw.tempFeatures;
const drawSupportActiveSelector = (state) => {
    const drawStatus = get(state, "draw.drawStatus", false);
    return drawStatus && drawStatus !== 'clean' && drawStatus !== 'stop';
};
export default {
    drawSupportActiveSelector,
    changedGeometriesSelector
};
