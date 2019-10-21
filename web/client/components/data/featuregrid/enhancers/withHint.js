
const {compose, branch, withProps} = require('recompose');
const tooltip = require('../../../misc/enhancers/tooltip');
const withPopover = require('./withPopover');


export default compose(
    withProps(({renderPopover, popoverOptions, ...props}) => {
        return renderPopover ? {renderPopover, popoverOptions, ...props} : {...props};
    }),
    branch(
        ({renderPopover, popoverOptions} = {}) => renderPopover && !!popoverOptions,
        withPopover,
        tooltip
    )
);
