/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { withProps, compose } from 'recompose';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isLoggedIn } from '../selectors/security';
import { dashboardHasWidgets, getWidgetsDependenciesGroups } from '../selectors/widgets';
import dashboard from '../reducers/dashboard';
import epics from '../epics/dashboard';
import {
    isDashboardEditing,
    showConnectionsSelector,
    dashboardResource,
    isDashboardLoading,
    buttonCanEdit
} from '../selectors/dashboard';
import SaveDialog from './dashboard/SaveDialog';
import ToolbarComp from '../components/misc/toolbar/Toolbar';

import { dashboardSelector } from './widgetbuilder/commons';
import { createWidget, toggleConnection } from '../actions/widgets';
import { triggerShowConnections, triggerSave, setEditing, setEditorAvailable } from '../actions/dashboard';
import withDashboardExitButton from './widgetbuilder/enhancers/withDashboardExitButton';
import LoadingSpinner from '../components/misc/LoadingSpinner';
import WidgetTypeBuilder from './widgetbuilder/WidgetTypeBuilder';

const Builder =
    compose(
        connect(dashboardSelector, { toggleConnection, triggerShowConnections }),
        withProps(({ availableDependencies = [] }) => ({
            availableDependencies: availableDependencies.filter(d => d !== "map")
        })),
        withDashboardExitButton
    )(WidgetTypeBuilder);

const Toolbar = compose(
    connect(
        createSelector(
            showConnectionsSelector,
            isLoggedIn,
            dashboardResource,
            dashboardHasWidgets,
            buttonCanEdit,
            getWidgetsDependenciesGroups,
            (showConnections, logged, resource, hasWidgets, edit, groups = []) => ({
                showConnections,
                hasConnections: groups.length > 0,
                hasWidgets,
                canEdit: edit,
                canSave: logged && hasWidgets && (resource ? resource.canEdit : true)
            })
        ),
        {
            onShowConnections: triggerShowConnections,
            onToggleSave: triggerSave,
            onAddWidget: createWidget
        }
    ),
    withProps(({
        onAddWidget = () => { },
        onToggleSave = () => { },
        hasWidgets,
        canSave,
        canEdit,
        hasConnections,
        showConnections,
        onShowConnections = () => { }
    }) => ({
        buttons: [{
            glyph: 'plus',
            tooltipId: 'dashboard.editor.addACardToTheDashboard',
            bsStyle: 'primary',
            visible: canEdit,
            id: 'ms-add-card-dashboard',
            onClick: () => onAddWidget()
        }, {
            glyph: 'floppy-disk',
            tooltipId: 'dashboard.editor.save',
            bsStyle: 'primary',
            tooltipPosition: 'right',
            visible: !!canSave,
            onClick: () => onToggleSave(true)
        }, {
            glyph: showConnections ? 'bulb-on' : 'bulb-off',
            tooltipId: showConnections ? 'dashboard.editor.hideConnections' : 'dashboard.editor.showConnections',
            bsStyle: showConnections ? 'success' : 'primary',
            visible: !!hasWidgets && !!hasConnections || !canEdit,
            onClick: () => onShowConnections(!showConnections)
        }]
    }))
)(ToolbarComp);


class DashboardEditorComponent extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        editing: PropTypes.bool,
        loading: PropTypes.bool,
        limitDockHeight: PropTypes.bool,
        fluid: PropTypes.bool,
        zIndex: PropTypes.number,
        dockSize: PropTypes.number,
        position: PropTypes.string,
        onMount: PropTypes.func,
        onUnmount: PropTypes.func,
        setEditing: PropTypes.func,
        dimMode: PropTypes.string,
        src: PropTypes.string,
        style: PropTypes.object
    };
    static defaultProps = {
        id: "dashboard-editor",
        editing: false,
        dockSize: 500,
        loading: true,
        limitDockHeight: true,
        zIndex: 10000,
        fluid: false,
        dimMode: "none",
        position: "left",
        onMount: () => { },
        onUnmount: () => { },
        setEditing: () => { }
    };
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }
    render() {
        return this.props.editing
            ? <div className="dashboard-editor de-builder"><Builder enabled={this.props.editing} onClose={() => this.props.setEditing(false)} catalog={this.props.catalog} /></div>
            : (<div className="ms-vertical-toolbar dashboard-editor de-toolbar" id={this.props.id}>
                <SaveDialog />
                <Toolbar transitionProps={false} btnGroupProps={{ vertical: true }} btnDefaultProps={{ tooltipPosition: 'right', className: 'square-button-md', bsStyle: 'primary' }} />
                {this.props.loading ? <LoadingSpinner style={{ position: 'fixed', bottom: 0}} /> : null}
            </div>);
    }
}

const Plugin = connect(
    createSelector(
        isDashboardEditing,
        isDashboardLoading,
        (editing, loading) => ({ editing, loading }),
    ), {
        setEditing,
        onMount: () => setEditorAvailable(true),
        onUnmount: () => setEditorAvailable(false)
    }
)(DashboardEditorComponent);
export default {
    DashboardEditorPlugin: Plugin,
    reducers: {
        dashboard
    },
    epics
};
