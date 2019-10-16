/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { compose } from 'recompose';

import { editableWidget, defaultIcons, withHeaderTools } from './tools';

module.exports = compose(
    require("./deleteWidget"),
    editableWidget(),
    defaultIcons(),
    withHeaderTools()
);
