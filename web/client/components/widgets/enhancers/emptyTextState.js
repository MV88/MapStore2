const React = require('react');
const Message = require('../../I18N/Message');
const emptyState = require('../../misc/enhancers/emptyState');

export default emptyState(
    ({text} = {}) => !text,
    ({iconFit} = {}) => ({
        iconFit,
        tooltip: <Message msgId="widgets.errors.notext" />
    })
);
