/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
    onCreateSnapshot,
    changeSnapshotState,
    saveImage,
    onRemoveSnapshot,
    onSnapshotError,
} from '../actions/snapshot';

import { mapSelector } from '../selectors/map';
import { layersSelector } from '../selectors/layers';
import { mapTypeSelector } from '../selectors/maptype';
import { toggleControl } from '../actions/controls';
import assign from 'object-assign';
import Message from './locale/Message';
import { Glyphicon } from 'react-bootstrap';

const snapshotSelector = createSelector([
    mapSelector,
    mapTypeSelector,
    layersSelector,
    (state) => state.controls && state.controls.toolbar && state.controls.toolbar.active === "snapshot" || state.controls.snapshot && state.controls.snapshot.enabled,
    (state) => state.browser,
    (state) => state.snapshot || {queue: []}
], (map, mapType, layers, active, browser, snapshot) => ({
    map,
    mapType,
    layers,
    active,
    browser,
    snapshot
}));

const SnapshotPanel = connect(snapshotSelector, {
    onCreateSnapshot: onCreateSnapshot,
    onStatusChange: changeSnapshotState,
    downloadImg: saveImage,
    toggleControl: toggleControl.bind(null, 'snapshot', null)
})(require("../components/mapcontrols/Snapshot/SnapshotPanel"));

const SnapshotPlugin = connect((state) => ({
    queue: state.snapshot && state.snapshot.queue || []
}), {
    downloadImg: saveImage,
    onSnapshotError,
    onRemoveSnapshot
})(require("../components/mapcontrols/Snapshot/SnapshotQueue"));


export default {
    SnapshotPlugin: assign(SnapshotPlugin, {
        Toolbar: {
            name: 'snapshot',
            position: 8,
            panel: SnapshotPanel,
            help: <Message msgId="helptexts.snapshot"/>,
            tooltip: "snapshot.tooltip",
            icon: <Glyphicon glyph="camera"/>,
            wrap: true,
            title: "snapshot.title",
            exclusive: true,
            priority: 1
        },
        BurgerMenu: {
            name: 'snapshot',
            position: 3,
            panel: SnapshotPanel,
            text: <Message msgId="snapshot.title"/>,
            icon: <Glyphicon glyph="camera"/>,
            action: toggleControl.bind(null, 'snapshot', null),
            tools: [SnapshotPlugin],
            priority: 2
        }
    }),
    reducers: {
        snapshot: require('../reducers/snapshot')
    }
};
