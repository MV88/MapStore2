import React from 'react';
import Message from '../../I18N/Message';
import emptyState from '../../misc/enhancers/emptyState';

const getErrorMessage = (error = {}) => {
    if (error.code === "ECONNABORTED") {
        return <Message msgId="widgets.errors.timeoutExpired" />;
    }
    return <Message msgId="widgets.errors.genericError" />;
};

module.exports = emptyState(
    ({error}) => error,
    ({error, iconFit} = {}) => ({
        glyph: "warning-sign",
        iconFit,
        tooltip: getErrorMessage(error)
    })
);
