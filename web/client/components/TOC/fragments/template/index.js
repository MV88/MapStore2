/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


/* eslint-disable */

// only require() is working
const Bootstrap = require('react-bootstrap');
const React = require('react');

const Message = require('../../../I18N/Message');

export const RenderTemplate = function(comp, props) {
    let model = props.model;
    return eval(comp);
};
/* eslint-enable */

export default RenderTemplate;
