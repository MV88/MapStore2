/*
* Copyright 2018, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import {
    loadMaps,
    updateMapMetadata,
    deleteMap,
    createThumbnail,
    updateDetails,
    deleteDetails,
    saveDetails,
    toggleDetailsSheet,
    toggleGroupProperties,
    toggleUnsavedChanges,
    setDetailsChanged,
    deleteThumbnail,
    saveMap,
    thumbnailError,
    saveAll,
    onDisplayMetadataEdit,
    resetUpdating,
    backDetails,
    undoDetails,
    updateAttribute
} from '../../actions/maps';
import MapGridComp from '../../components/maps/MapGrid';
import {
    editMap,
    updateCurrentMap,
    errorCurrentMap,
    removeThumbnail,
    resetCurrentMap
} from '../../actions/currentMap';

import { mapTypeSelector } from '../../selectors/maptype';
import { showMapDetailsSelector } from '../../selectors/maps.js';

const MapsGrid = connect((state) => {
    return {
        bsSize: "small",
        currentMap: state.currentMap,
        showMapDetails: showMapDetailsSelector(state),
        loading: state.maps && state.maps.loading,
        mapType: mapTypeSelector(state)
    };
}, dispatch => {
    return {
        loadMaps: (...params) => dispatch(loadMaps(...params)),
        updateMapMetadata: (...params) => dispatch(updateMapMetadata(...params)),
        editMap: (...params) => dispatch(editMap(...params)),
        saveMap: (...params) => dispatch(saveMap(...params)),
        removeThumbnail: (...params) => dispatch(removeThumbnail(...params)),
        onDisplayMetadataEdit: (...params) => dispatch(onDisplayMetadataEdit(...params)),
        resetUpdating: (...params) => dispatch(resetUpdating(...params)),
        saveAll: (...params) => dispatch(saveAll(...params)),
        updateCurrentMap: (...params) => dispatch(updateCurrentMap(...params)),
        errorCurrentMap: (...params) => dispatch(errorCurrentMap(...params)),
        thumbnailError: (...params) => dispatch(thumbnailError(...params)),
        createThumbnail: (...params) => dispatch(createThumbnail(...params)),
        deleteThumbnail: (...params) => dispatch(deleteThumbnail(...params)),
        deleteMap: (...params) => dispatch(deleteMap(...params)),
        resetCurrentMap: (...params) => dispatch(resetCurrentMap(...params)),
        onUpdateAttribute: (...params) => dispatch(updateAttribute(...params)),
        detailsSheetActions: bindActionCreators({
            onBackDetails: backDetails,
            onUndoDetails: undoDetails,
            onToggleDetailsSheet: toggleDetailsSheet,
            onToggleGroupProperties: toggleGroupProperties,
            onToggleUnsavedChangesModal: toggleUnsavedChanges,
            onsetDetailsChanged: setDetailsChanged,
            onUpdateDetails: updateDetails,
            onSaveDetails: saveDetails,
            onDeleteDetails: deleteDetails
        }, dispatch)
    };
})(MapGridComp);

export default MapsGrid;
