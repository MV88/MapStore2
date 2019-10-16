import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { mapTypeSelector } from '../../../selectors/maptype';
module.exports = connect(createSelector(mapTypeSelector, mapType => ({mapType})));
