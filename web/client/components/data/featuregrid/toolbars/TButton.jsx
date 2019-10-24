/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
const hideStyle = {
    width: 0,
    padding: 0,
    borderWidth: 0
};
const normalStyle = {};
const getStyle = (visible) => visible ? normalStyle : hideStyle;

export default class SimpleTButton extends React.Component {
    static propTypes = {
        disabled: PropTypes.boolean,
        id: PropTypes.string,
        visible: PropTypes.boolean,
        onClick: PropTypes.func,
        glyph: PropTypes.string,
        active: PropTypes.boolean,
        className: PropTypes.string
    }
    render() {
        const {disabled, id, visible, onClick, glyph, active, className = "square-button", ...props} = this.props;
        return (<Button {...props} bsStyle={active ? "success" : "primary"} disabled={disabled} id={`fg-${id}`}
            style={getStyle(visible)}
            className={className}
            onClick={() => !disabled && onClick()}>
            <Glyphicon glyph={glyph}/>
        </Button>);
    }
}
