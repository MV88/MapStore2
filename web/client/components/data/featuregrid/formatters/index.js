/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import {isNil} from 'lodash';

export const getFormatter = (desc) => desc.localType === 'boolean' ?
    ({value} = {}) => !isNil(value) ? <span>{value.toString()}</span> : null :
    null;
