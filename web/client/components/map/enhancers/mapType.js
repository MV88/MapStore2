/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { withPropsOnChange } from 'recompose';

export default withPropsOnChange(
    ['mapType', 'plugins'],
    async({mapType, plugins} = {}) => {
        const plugin = await import(
            `../plugins/${mapType}.json`);
        return {plugins: {...plugin(), ...plugins}};
    }
);
