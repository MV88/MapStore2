/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
export const TOGGLE_GRATICULE = 'TOGGLE_GRATICULE';
export const UPDATE_MARKER = 'UPDATE_MARKER';


export const toggleGraticule = () => {
    return {
        type: TOGGLE_GRATICULE
    };
};

export const updateMarker = (point) => {
    return {
        type: UPDATE_MARKER,
        point
    };
};
