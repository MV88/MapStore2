/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import assign from 'object-assign';
import { getUserGroups, editGroup, deleteGroup } from '../../../actions/usergroups';
import PaginationToolbar from './GroupsPaginationToolbar';

const mapStateToProps = (state) => {
    const usergroups = state && state.usergroups;
    return {
        groups: usergroups && state.usergroups.groups,
        loading: usergroups && usergroups.status === "loading",
        stateProps: usergroups && usergroups.stateProps,
        start: usergroups && usergroups.start,
        limit: usergroups && usergroups.limit,
        myUserId: state && state.security && state.security.user && state.security.user.id
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loadGroups: getUserGroups,
        onEdit: editGroup,
        onDelete: deleteGroup
    }, dispatch);
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return assign({}, stateProps, dispatchProps, ownProps, {
        bottom: <PaginationToolbar />,
        loadGroups: () => {
            dispatchProps.loadGroups(stateProps && stateProps.searchText, {
                params: {
                    start: stateProps && stateProps.start || 0,
                    limit: stateProps && stateProps.limit || 12
                }
            });
        }
    });
};
export default connect(mapStateToProps, mapDispatchToProps, mergeProps, {pure: false})(require('../../../components/manager/users/GroupGrid'));
