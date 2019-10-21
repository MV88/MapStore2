const {connect} = require('react-redux');
const { createSelector } = require('reselect');
const { mapTypeSelector } = require('../../../selectors/maptype');
export default connect(createSelector(mapTypeSelector, mapType => ({mapType})));
