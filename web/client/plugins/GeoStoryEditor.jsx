/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
    currentStorySelector,
    currentPageSelector,
    isCollapsedSelector,
    isSettingsEnabledSelector,
    isToolbarEnabledSelector,
    modeSelector,
    settingsItemsSelector,
    selectedCardSelector,
    settingsSelector,
    settingsChangedSelector
} from '../selectors/geostory';
import geostory from '../reducers/geostory';
import {
    updateSettings,
    move,
    remove,
    setEditing,
    selectCard,
    toggleCardPreview,
    toggleSettingsPanel,
    toggleSettings,
    update
} from '../actions/geostory';

import Builder from '../components/geostory/builder/Builder';
import { Modes, scrollToContent } from '../utils/GeoStoryUtils';
import { createPlugin } from '../utils/PluginsUtils';


const GeoStoryEditor = ({
    currentPage,
    isCollapsed,
    isSettingsChanged = false,
    isSettingsEnabled,
    isToolbarEnabled,
    mode = Modes.VIEW,
    story = {},
    settings = {},
    settingsItems,
    selected,

    setEditingMode = () => {},
    onToggleCardPreview = () => {},
    onToggleSettingsPanel = () => {},
    onToggleSettings = () => {},
    onUpdateSettings = () => {},
    onSelect = () => {},
    onRemove = () => {},
    onUpdate = () => {},
    onSort = () => {}
}) => (mode === Modes.EDIT ? <div
    key="left-column"
    className="ms-geostory-editor"
    style={{ order: -1, width: 400, position: 'relative' }}>
    <Builder
        currentPage={currentPage}
        isCollapsed={isCollapsed}
        isSettingsChanged={isSettingsChanged}
        isSettingsEnabled={isSettingsEnabled}
        isToolbarEnabled={isToolbarEnabled}
        mode={mode}
        scrollTo={(id, options = { behavior: "smooth" }) => {
            scrollToContent(id, options);
        }}
        selected={selected}
        settings={settings}
        settingsItems={settingsItems}
        story={story}

        setEditing={setEditingMode}
        onRemove={onRemove}
        onSelect={onSelect}
        onSort={onSort}
        onToggleCardPreview={onToggleCardPreview}
        onToggleSettings={onToggleSettings}
        onToggleSettingsPanel={onToggleSettingsPanel}
        onUpdate={onUpdate}
        onUpdateSettings={onUpdateSettings}
    />
</div> : null);
/**
 * Plugin for GeoStory side panel editor
 * @name GeoStoryEditor
 * @memberof plugins
 */
export default createPlugin('GeoStoryEditor', {
    component: connect(
        createStructuredSelector({
            isCollapsed: isCollapsedSelector,
            mode: modeSelector,
            story: currentStorySelector,
            currentPage: currentPageSelector,
            settingsItems: settingsItemsSelector,
            settings: settingsSelector,
            isSettingsChanged: settingsChangedSelector,
            isToolbarEnabled: isToolbarEnabledSelector,
            isSettingsEnabled: isSettingsEnabledSelector,
            selected: selectedCardSelector
        }), {
            setEditingMode: setEditing,
            onUpdateSettings: updateSettings,
            onToggleCardPreview: toggleCardPreview,
            onToggleSettingsPanel: toggleSettingsPanel,
            onToggleSettings: toggleSettings,
            onRemove: remove,
            onSelect: selectCard,
            onSort: move,
            onUpdate: update
        }
    )(GeoStoryEditor),
    reducers: {
        geostory
    }
});
