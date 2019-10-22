/**
  * Copyright 2017, GeoSolutions Sas.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree.
  */

import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { widgetBuilderAvailable, wfsDownloadAvailable } from '../../../selectors/controls';

import {
    paginationInfo,
    featureLoadingSelector,
    resultsSelector,
    isSyncWmsActive,
    featureCollectionResultSelector,
    isDescribeLoaded,
    isFilterActive
} from '../../../selectors/query';

import {
    getTitleSelector,
    modeSelector,
    selectedFeaturesCount,
    hasChangesSelector,
    hasGeometrySelector,
    isSimpleGeomSelector,
    hasNewFeaturesSelector,
    isSavingSelector,
    isSavedSelector,
    isDrawingSelector,
    canEditSelector,
    getAttributeFilter,
    hasSupportedGeometry,
    editingAllowedRolesSelector,
    timeSyncActive,
    showTimeSync,
    chartDisabledSelector,
    showAgainSelector,
    showPopoverSyncSelector,
    selectedLayerNameSelector
} from '../../../selectors/featuregrid';

import { userRoleSelector } from '../../../selectors/security';
import { isCesium } from '../../../selectors/maptype';
import { mapLayoutValuesSelector } from '../../../selectors/maplayout';

import {
    deleteFeatures,
    toggleTool,
    clearChangeConfirmed,
    closeFeatureGridConfirmed,
    closeFeatureGrid
} from '../../../actions/featuregrid';

import { toolbarEvents, pageEvents } from '../index';
import { getAttributeFields } from '../../../utils/FeatureGridUtils';
import { getFilterRenderer } from '../../../components/data/featuregrid/filterRenderers';

import EmptyRowsViewComp from '../../../components/data/featuregrid/EmptyRowsView';
import ToolbarComp from '../../../components/data/featuregrid/toolbars/Toolbar';
import HeaderComp from '../../../components/data/featuregrid/Header';
import FooterComp from '../../../components/data/featuregrid/Footer';
import ConfirmDeleteComp from '../../../components/data/featuregrid/dialog/ConfirmDelete';
import ConfirmClearComp from '../../../components/data/featuregrid/dialog/ConfirmClear';
import ConfirmFeatureCloseComp from '../../../components/data/featuregrid/dialog/ConfirmFeatureClose';


const filterEditingAllowedUser = (role, editingAllowedRoles = ["ADMIN"]) => {
    return editingAllowedRoles.indexOf(role) !== -1;
};
const EmptyRowsView = connect(createStructuredSelector({
    loading: featureLoadingSelector
}))(EmptyRowsViewComp);
const Toolbar = connect(
    createStructuredSelector({
        saving: isSavingSelector,
        saved: isSavedSelector,
        mode: modeSelector,
        hasChanges: hasChangesSelector,
        hasNewFeatures: hasNewFeaturesSelector,
        hasGeometry: hasGeometrySelector,
        syncPopover: state => ({
            showAgain: showAgainSelector(state),
            showPopoverSync: showPopoverSyncSelector(state),
            dockSize: mapLayoutValuesSelector(state, {dockSize: true}).dockSize + 3.2 + "%"
        }),
        isDrawing: isDrawingSelector,
        showChartButton: state => !chartDisabledSelector(state) && widgetBuilderAvailable(state),
        isSimpleGeom: isSimpleGeomSelector,
        selectedCount: selectedFeaturesCount,
        disableToolbar: state => state && state.featuregrid && state.featuregrid.disableToolbar || !isDescribeLoaded(state, selectedLayerNameSelector(state)),
        displayDownload: wfsDownloadAvailable,
        disableDownload: state => (resultsSelector(state) || []).length === 0,
        isDownloadOpen: state => state && state.controls && state.controls.wfsdownload && state.controls.wfsdownload.enabled,
        isSyncActive: isSyncWmsActive,
        isColumnsOpen: state => state && state.featuregrid && state.featuregrid.tools && state.featuregrid.tools.settings,
        disableZoomAll: (state) => state && state.featuregrid.virtualScroll || featureCollectionResultSelector(state).features.length === 0,
        isSearchAllowed: (state) => !isCesium(state),
        isEditingAllowed: (state) => (filterEditingAllowedUser(userRoleSelector(state), editingAllowedRolesSelector(state)) || canEditSelector(state)) && !isCesium(state),
        hasSupportedGeometry,
        isFilterActive,
        showTimeSyncButton: showTimeSync,
        timeSync: timeSyncActive
    }),
    (dispatch) => ({events: bindActionCreators(toolbarEvents, dispatch)})
)(ToolbarComp);


const Header = connect(
    createSelector(
        getTitleSelector,
        (title) => ({title})),
    {
        onClose: toolbarEvents.onClose
    }
)(HeaderComp);

// loading={props.featureLoading} totalFeatures={props.totalFeatures} resultSize={props.resultSize}/
const Footer = connect(
    createSelector(
        createStructuredSelector(paginationInfo),
        featureLoadingSelector,
        state => state && state.featuregrid && !!state.featuregrid.virtualScroll,
        (pagination, loading, virtualScroll) => ({
            ...pagination,
            loading,
            virtualScroll
        })),
    pageEvents
)(FooterComp);
const DeleteDialog = connect(
    createSelector(selectedFeaturesCount, (count) => ({count})), {
        onClose: () => toggleTool("deleteConfirm", false),
        onConfirm: () => deleteFeatures()
    })(ConfirmDeleteComp);
const ClearDialog = connect(
    createSelector(selectedFeaturesCount, (count) => ({count})), {
        onClose: () => toggleTool("clearConfirm", false),
        onConfirm: () => clearChangeConfirmed()
    })(ConfirmClearComp);
const FeatureCloseDialog = connect(() => {}
    , {
        onClose: () => closeFeatureGridConfirmed(),
        onConfirm: () => closeFeatureGrid()
    })(ConfirmFeatureCloseComp);

import settings from './AttributeSelector';

const panels = {
    settings
};

const dialogs = {
    deleteConfirm: DeleteDialog,
    featureCloseConfirm: FeatureCloseDialog,
    clearConfirm: ClearDialog
};
const panelDefaultProperties = {
    settings: {
        style: { padding: '0 12px', overflow: "auto", flex: "0 0 14em", boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.4)", height: "100%", minWidth: 195}
    }
};

export default {
    getPanels: (tools = {}) =>
        Object.keys(tools)
            .filter(t => tools[t] && panels[t])
            .map(t => {
                const Panel = panels[t];
                return <Panel key={t} {...(panelDefaultProperties[t] || {})} />;
            }),
    getHeader: () => {
        return <Header ><Toolbar /></Header>;
    },
    getFooter: (props) => {
        return ( props.focusOnEdit && props.hasChanges || props.newFeatures.length > 0) ? null : <Footer />;
    },
    getEmptyRowsView: () => {
        return EmptyRowsView;
    },
    getFilterRenderers: createSelector((d) => d,
        (describe) =>
            describe ? getAttributeFields(describe).reduce( (out, cur) => ({
                ...out,
                [cur.name]: connect(
                    createSelector(
                        (state) => getAttributeFilter(state, cur.name),
                        modeSelector,
                        (filter, mode) => {
                            const props = {
                                value: filter && (filter.rawValue || filter.value)
                            };
                            const editProps = {
                                disabled: true,
                                tooltipMsgId: "featuregrid.filter.tooltips.editMode"
                            };
                            return mode === "EDIT" ? {...props, ...editProps} : props;
                        }
                    ))(getFilterRenderer(cur.localType, {name: cur.name}))
            }), {}) : {}),
    getDialogs: (tools = {}) => {
        return Object.keys(tools)
            .filter(t => tools[t] && dialogs[t])
            .map(t => {
                const Dialog = dialogs[t];
                return <Dialog key={t} />;
            });
    }
};
