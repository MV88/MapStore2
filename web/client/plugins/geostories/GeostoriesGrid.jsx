/*
* Copyright 2019, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import withShareTool from '../../components/resources/enhancers/withShareTool';
import { success } from '../../actions/notifications';

import { compose, defaultProps, withHandlers } from 'recompose';

import { deleteGeostory, reloadGeostories } from '../../actions/geostories';
import { updateAttribute, setFeaturedMapsLatestResource } from '../../actions/maps'; // TODO: externalize
import { userSelector } from '../../selectors/security';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import resourceGrid from '../../components/resources/enhancers/resourceGrid';
import ResourceGrid from '../../components/resources/ResourceGrid';

const Grid = compose(
    connect(createSelector(userSelector, user => ({ user })), {
        onDelete: deleteGeostory,
        reloadGeostories,
        onShowSuccessNotification: () => success({ title: "success", message: "resources.successSaved" }),
        setFeaturedMapsLatestResource,
        onUpdateAttribute: updateAttribute
    }),
    withHandlers({
        onSaveSuccess: (props) => (resource) => {
            if (props.reloadGeostories) {
                props.reloadGeostories();
            }
            if (props.setFeaturedMapsLatestResource) {
                props.setFeaturedMapsLatestResource(resource);
            }
            if (props.onShowSuccessNotification) {
                props.onShowSuccessNotification();
            }
        }
    }),
    defaultProps({
        category: "GEOSTORY"
    }),
    resourceGrid,
    // add and configure share tool panel
    compose(
        defaultProps({ shareOptions: { embedPanel: false, advancedSettings: { homeButton: true } } }),
        withShareTool
    )
)(ResourceGrid);

export default Grid;
