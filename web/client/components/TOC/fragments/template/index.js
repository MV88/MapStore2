/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable */
import Bootstrap from 'react-bootstrap';

import Message from '../../../I18N/Message';
import React from 'react';

const RenderTemplate = function(comp, props) {
    let model = props.model;
    return eval(comp);
};
/* eslint-enable */

export default RenderTemplate;
