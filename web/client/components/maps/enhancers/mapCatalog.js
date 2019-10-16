
import { compose } from 'recompose';
import { withSearchTextState, withVirtualScroll, searchOnTextChange } from './enhancers';
module.exports = compose(
    withSearchTextState,
    withVirtualScroll,
    searchOnTextChange
);
