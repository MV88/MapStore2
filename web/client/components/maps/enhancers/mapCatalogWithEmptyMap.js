
import { compose } from 'recompose';
import { withSearchTextState, withEmptyMapVirtualScroll, searchOnTextChange } from './enhancers';
module.exports = compose(
    withSearchTextState,
    withEmptyMapVirtualScroll,
    searchOnTextChange
);
