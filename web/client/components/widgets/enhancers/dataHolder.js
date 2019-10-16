/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { compose, withState, withHandlers } from 'recompose';

module.exports = compose(
    // table / chart visualization
    withState('data', 'setData', {}),
    withHandlers({
        onChange: ({ data, setData }) => (key, value) => setData({...data, [key]: value})
    })
);
