/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
    Popover,
    Glyphicon,
    Button
} from 'react-bootstrap';

import Overlay from '../../misc/Overlay';
/**
 * ControlledPopover. A component that renders a icon with a Popover
 * it uses:
 * - mouseEnter on glyph to open
 * - click to close
 * it supports fixed text with clickable link
 * @prop {string} title the title of popover
 * @prop {string|function} text the text of popover (can be a component, like I18N.HTML)
 * @prop {string} glyph glyph id for the icon
 * @prop {number} left left prop of popover
 * @prop {number} right right prop of popover
 * @prop {string} placement position of popover
 */
const ControlledPopover = ({
    text,
    placement,
    bsStyle,
    left,
    top,
    title,
    glyph,
    id
}) => {
    const trigger = useRef();
    const [show, setShow] = useState(false);
    return (
        <span className="mapstore-info-popover">
            <Glyphicon
                onMouseEnter={() => {
                    setShow(true);
                }}
                ref={(popover) => {
                    trigger.current = popover;
                }}
                className={`text-${bsStyle}`}
                glyph={glyph} />
            <Overlay placement={placement} show={show} target={() => ReactDOM.findDOMNode(trigger.current)}>
                <Popover
                    id={id}
                    placement={placement}
                    positionLeft={left}
                    positionTop={top}
                    title={title}>
                    <div style={{display: "flex"}}>
                        <div>{text}</div>
                        <Button className="no-border" style={{alignSelf: "flex-start"}} onClick={() => {
                            setShow(false);
                        }}><Glyphicon glyph="1-close"/></Button>

                    </div>
                </Popover>
            </Overlay>
        </span>
    );
};

ControlledPopover.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    glyph: PropTypes.string,
    bsStyle: PropTypes.string,
    placement: PropTypes.string,
    left: PropTypes.number,
    top: PropTypes.number,
    trigger: PropTypes.oneOfType([PropTypes.array, PropTypes.bool])
};

ControlledPopover.defaultProps = {
    id: '',
    title: '',
    text: '',
    placement: 'right',
    left: 200,
    top: 50,
    glyph: "question-sign",
    bsStyle: 'info'
};

export default ControlledPopover;
