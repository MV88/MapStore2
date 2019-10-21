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
