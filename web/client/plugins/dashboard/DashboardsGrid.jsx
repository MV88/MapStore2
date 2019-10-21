/*
* Copyright 2018, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import { compose, defaultProps, withHandlers } from 'recompose';

import { deleteDashboard, reloadDashboards } from '../../actions/dashboards';
import { updateAttribute, setFeaturedMapsLatestResource } from '../../actions/maps'; // TODO: externalize
import { userSelector } from '../../selectors/security';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import resourceGrid from '../../components/resources/enhancers/resourceGrid';
const Grid = compose(
    connect(createSelector(userSelector, user => ({ user })), {
        onDelete: deleteDashboard,
        reloadDashboards,
        setFeaturedMapsLatestResource,
        onUpdateAttribute: updateAttribute
    }),
    withHandlers({
        onSaveSuccess: (props) => (resource) => {
            if (props.reloadDashboards) {
                props.reloadDashboards();
            }
            if (props.setFeaturedMapsLatestResource) {
                props.setFeaturedMapsLatestResource(resource);
            }
        }
    }),
    defaultProps({
        category: "DASHBOARD"
    }),
    resourceGrid
)(require('../../components/resources/ResourceGrid'));

export default Grid;
