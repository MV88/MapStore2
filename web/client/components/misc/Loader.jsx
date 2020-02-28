/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import PropTypes from 'prop-types';

const sizeToClass = size => size > 100
    ? 'full'
    : size > 40
        ? 'medium'
        : 'small';

const Loader = ({ size, style = {}, className}) => (<div className={className}
    style={{ width: size, height: size, overflow: "hidden", ...style }}>
    <div className={`mapstore-${sizeToClass(size)}-size-loader`}></div>
</div>);

Loader.propTypes = {
    size: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object
};

export default Loader;
