const React = require('react');
const OverlayTrigger = require('../../../misc/OverlayTrigger');
const {Tooltip} = require('react-bootstrap');

export default (Wrapped) => ({tooltip, id, placement, ...props}) =>
    (<OverlayTrigger placement={placement} overlay={<Tooltip id={`fe-${id}`}>{tooltip}</Tooltip>}>
        <Wrapped {...props}/>
    </OverlayTrigger>);
