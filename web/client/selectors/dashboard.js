/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';

import { pathnameSelector } from '../selectors/router';

export const isDashboardAvailable = state => state && state.dashboard && state.dashboard.editor && state.dashboard.editor.available;
export const isShowSaveOpen = state => state && state.dashboard && state.dashboard.showSaveModal;
export const isShowSaveAsOpen = state => state && state.dashboard && state.dashboard.showSaveAsModal;
export const isDashboardEditing = state => state && state.dashboard && state.dashboard.editing;
export const showConnectionsSelector = state => state && state.dashboard && state.dashboard.showConnections;
export const dashboardResource = state => state && state.dashboard && state.dashboard.resource;
export const isDashboardLoading = state => state && state.dashboard && state.dashboard.loading;
export const getDashboardSaveErrors = state => state && state.dashboard && state.dashboard.saveErrors;
export const buttonCanEdit = createSelector(pathnameSelector, dashboardResource,
    (path, resource) => resource && resource.canEdit || isNaN(path.substr(-4)));
