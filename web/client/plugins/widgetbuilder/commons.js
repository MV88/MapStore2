/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { createSelector } from 'reselect';

import { showConnectionsSelector } from '../../selectors/dashboard';
import {
    availableDependenciesSelector,
    dependenciesSelector,
    getEditingWidget,
    getEditorSettings,
    getWidgetLayer
} from '../../selectors/widgets';

export const wizardStateToProps = ( stateProps = {}, dispatchProps = {}, ownProps = {}) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    step: stateProps && stateProps.settings && stateProps.settings.step,
    valid: stateProps && stateProps.settings && stateProps.settings.valid,
    onFinish: () => dispatchProps.insertWidget && dispatchProps.insertWidget({
        layer: stateProps.layer,
        url: stateProps.layer && stateProps.layer.url,
        ...(stateProps.editorData || {})
    }, ownProps.target)
});
export const wizardSelector = createSelector(
    getWidgetLayer,
    getEditingWidget,
    getEditorSettings,
    (layer, editorData, settings) => ({
        layer: (editorData && editorData.layer) || layer,
        editorData,
        settings
    })
);
export const dashboardSelector = createSelector(
    getEditingWidget,
    showConnectionsSelector,
    dependenciesSelector,
    availableDependenciesSelector,
    ({ layer }, showConnections, dependencies, dependencyConnectProps) => ({
        layer,
        showConnections,
        dependencies,
        ...dependencyConnectProps
    }));
