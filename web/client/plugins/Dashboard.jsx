/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { get } from 'lodash';
import { connect } from 'react-redux';
import { compose, withProps, withHandlers } from 'recompose';
import { createSelector } from 'reselect';

import {
    getDashboardWidgets,
    dependenciesSelector,
    getDashboardWidgetsLayout,
    isWidgetSelectionActive,
    getEditingWidget,
    getWidgetsDependenciesGroups,
} from '../selectors/widgets';

import {
    editWidget,
    updateWidgetProperty,
    deleteWidget,
    changeLayout,
    exportCSV,
    exportImage,
    selectWidget,
} from '../actions/widgets';

import { showConnectionsSelector, dashboardResource, isDashboardLoading } from '../selectors/dashboard';
import ContainerDimensions from 'react-container-dimensions';
import PropTypes from 'prop-types';
const WidgetsView = compose(
    connect(
        createSelector(
            dashboardResource,
            getDashboardWidgets,
            getDashboardWidgetsLayout,
            dependenciesSelector,
            isWidgetSelectionActive,
            (state) => get(getEditingWidget(state), "id"),
            getWidgetsDependenciesGroups,
            showConnectionsSelector,
            isDashboardLoading,
            (resource, widgets, layouts, dependencies, selectionActive, editingWidgetId, groups, showGroupColor, loading) => ({
                resource,
                loading,
                canEdit: (resource ? !!resource.canEdit : true),
                widgets,
                layouts,
                dependencies,
                selectionActive,
                editingWidgetId,
                groups,
                showGroupColor
            })
        ), {
            editWidget,
            updateWidgetProperty,
            exportCSV,
            exportImage,
            deleteWidget,
            onWidgetSelected: selectWidget,
            onLayoutChange: changeLayout
        }
    ),
    withProps(() => ({
        style: {
            height: "100%",
            overflow: "auto"
        }
    })),
    withHandlers({
        // TODO: maybe using availableDependencies here will be better when different widgets type dependencies are supported
        isWidgetSelectable: ({ editingWidgetId }) => ({ widgetType, id }) => widgetType === "map" && id !== editingWidgetId
    })
)(require('../components/dashboard/Dashboard'));


class Widgets extends React.Component {
    static propTypes = {
        enabled: PropTypes.bool
    };
    static defaultProps = {
        enabled: true
    };
    render() {
        return this.props.enabled ? (<ContainerDimensions>{({ width, height }) => <WidgetsView width={width} height={height} />}</ContainerDimensions>) : null;

    }
}

const DashboardPlugin = Widgets;

export default {
    DashboardPlugin,
    reducers: {
        widgets: require('../reducers/widgets')
    }
};
