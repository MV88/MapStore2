
const {compose} = require('recompose');
const { withSearchTextState, withEmptyMapVirtualScroll, searchOnTextChange} = require('./enhancers');
export default compose(
    withSearchTextState,
    withEmptyMapVirtualScroll,
    searchOnTextChange
);
