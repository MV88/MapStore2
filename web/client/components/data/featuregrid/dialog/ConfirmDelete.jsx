const React = require('react');
const Confirm = require('../../../misc/ConfirmDialog');
const Message = require('../../../I18N/Message');
module.exports = ({
    onClose= () => {},
    status= "confirm",
    onConfirm= () => {}
} = {}) => (<Confirm
    show
    onClose={onClose}
    onConfirm={onConfirm}
    confirmButtonContent={<Message msgId="delete" />}
    confirmButtonDisabled={status === "deleting"}/>);
