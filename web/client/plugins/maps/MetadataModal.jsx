/*
* Copyright 2018, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import { connect } from 'react-redux';

import { metadataChanged } from '../../actions/maps';
import { loadPermissions, updatePermissions, loadAvailableGroups } from '../../actions/maps';
import { updateCurrentMapPermissions, addCurrentMapPermission } from '../../actions/currentMap';
import { setControlProperty } from '../../actions/controls';
import { showMapDetailsSelector } from '../../selectors/maps.js';

const MetadataModal = connect(
    (state = {}) => ({
        metadata: state.currentMap.metadata,
        showDetailsRow: showMapDetailsSelector(state),
        availableGroups: state.currentMap && state.currentMap.availableGroups || [ ], // TODO: add message when array is empty
        newGroup: state.controls && state.controls.permissionEditor && state.controls.permissionEditor.newGroup,
        newPermission: state.controls && state.controls.permissionEditor && state.controls.permissionEditor.newPermission || "canRead",
        user: state.security && state.security.user || {name: "Guest"}
    }),
    {
        loadPermissions, loadAvailableGroups, updatePermissions, onGroupsChange: updateCurrentMapPermissions, onAddPermission: addCurrentMapPermission, metadataChanged,
        onNewGroupChoose: setControlProperty.bind(null, 'permissionEditor', 'newGroup'),
        onNewPermissionChoose: setControlProperty.bind(null, 'permissionEditor', 'newPermission')
    }, null)(require('../../components/maps/modals/MetadataModal'));

export default MetadataModal;
