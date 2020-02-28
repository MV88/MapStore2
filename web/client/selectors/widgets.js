/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { castArray, get } from 'lodash';
import { createSelector, createStructuredSelector } from 'reselect';

import { DEFAULT_TARGET, DEPENDENCY_SELECTOR_KEY, WIDGETS_REGEX } from '../actions/widgets';
import { createShallowSelector } from '../utils/ReselectUtils';
import { getWidgetDependency, getWidgetsGroups } from '../utils/WidgetsUtils';
import { isDashboardAvailable, isDashboardEditing } from './dashboard';
import { getSelectedLayer } from './layers';
import { mapSelector } from './map';

export const getEditorSettings = state => get(state, "widgets.builder.settings");
export const getDependenciesMap = s => get(s, "widgets.dependencies") || {};
export const getDependenciesKeys = s => Object.keys(getDependenciesMap(s)).map(k => getDependenciesMap(s)[k]);
export const getEditingWidget = state => get(state, "widgets.builder.editor");
export const getWidgetLayer = createSelector(
    getEditingWidget,
    getSelectedLayer,
    state => isDashboardAvailable(state) && isDashboardEditing(state),
    ({layer} = {}, selectedLayer, dashboardEditing) => layer || !dashboardEditing && selectedLayer
);

export const getFloatingWidgets = state => get(state, `widgets.containers[${DEFAULT_TARGET}].widgets`);
export const getCollapsedState = state => get(state, `widgets.containers[${DEFAULT_TARGET}].collapsed`);
export const getVisibleFloatingWidgets = createSelector(
    getFloatingWidgets,
    getCollapsedState,
    (widgets, collapsed) => {
        if (widgets && collapsed) {
            return widgets.filter(({ id } = {}) => !collapsed[id]);
        }
        return widgets;
    }
);
export const getCollapsedIds = createSelector(
    getCollapsedState,
    (collapsed = {}) => Object.keys(collapsed)
);
export const getMapWidgets = state => (getFloatingWidgets(state) || []).filter(({ widgetType } = {}) => widgetType === "map");

/**
 * Find in the state the available dependencies to connect
 */
export const availableDependenciesSelector = createSelector(
    getMapWidgets,
    mapSelector,
    (ws = [], map = []) => ({
        availableDependencies: ws.map(({id}) => `widgets[${id}].map`).concat(castArray(map).map(() => "map"))
    })
);
/**
 * returns if the dependency selector state
 * @param {object} state the state
 */
export const getDependencySelectorConfig = state => get(getEditorSettings(state), `${DEPENDENCY_SELECTOR_KEY}`);
/**
 * Determines if the dependencySelector is active
 * @param {object} state the state
 */
export const isWidgetSelectionActive = state => get(getDependencySelectorConfig(state), 'active');

export const getWidgetsDependenciesGroups = createSelector(
    getFloatingWidgets,
    widgets => getWidgetsGroups(widgets)
);
export const getFloatingWidgetsLayout = state => get(state, `widgets.containers[${DEFAULT_TARGET}].layouts`);
export const getFloatingWidgetsCurrentLayout = state => get(state, `widgets.containers[${DEFAULT_TARGET}].layout`);

export const getDashboardWidgets = state => get(state, `widgets.containers[${DEFAULT_TARGET}].widgets`);

export const isTrayEnabled = state => get(state, "widgets.tray");
export const dashboardHasWidgets = state => (getDashboardWidgets(state) || []).length > 0;
export const getDashboardWidgetsLayout = state => get(state, `widgets.containers[${DEFAULT_TARGET}].layouts`);
export const getEditingWidgetLayer = state => get(getEditingWidget(state), "layer");
export const returnToFeatureGridSelector = (state) => get(state, "widgets.builder.editor.returnToFeatureGrid", false);
export const getEditingWidgetFilter = state => get(getEditingWidget(state), "filter");

export const dashBoardDependenciesSelector = () => ({}); // TODO dashboard dependencies
/**
 * transforms dependencies in the form `{ k1: "path1", k1, "path2" }` into
 * a map like `{k1: v1, k2: v2}` where `v1 = get("path1", state)`.
 * Dependencies paths map comes from getDependenciesMap.
 * map.... is a special path that brings to the map of mapstore.
 */
export const dependenciesSelector = createShallowSelector(
    getDependenciesMap,
    getDependenciesKeys,
    // produces the array of values of the keys in getDependenciesKeys
    state => getDependenciesKeys(state).map(k =>
        k.indexOf("map.") === 0
            ? get(mapSelector(state), k.slice(4))
            : k.match(WIDGETS_REGEX)
                ? getWidgetDependency(k, getFloatingWidgets(state))
                : get(state, k) ),
    // iterate the dependencies keys to set the dependencies values in a map
    (map, keys, values) => keys.reduce((acc, k, i) => ({
        ...acc,
        [Object.keys(map)[i]]: values[i]
    }), {})
);
export const widgetsConfig = createStructuredSelector({
    widgets: getFloatingWidgets,
    layouts: getFloatingWidgetsLayout
});
