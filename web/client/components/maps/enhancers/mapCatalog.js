
const {compose} = require('recompose');
const { withSearchTextState, withVirtualScroll, searchOnTextChange} = require('./enhancers');
export default compose(
    withSearchTextState,
    withVirtualScroll,
    searchOnTextChange
);
