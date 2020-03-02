/*
<<<<<<< HEAD
* Copyright 2019, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/
import React from 'react';
import {compose, withProps} from 'recompose';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {Glyphicon} from 'react-bootstrap';
import {indexOf} from 'lodash';
import Message from '../components/I18N/Message';
import {mapInfoSelector} from '../selectors/map';
import { isLoggedIn } from '../selectors/security';
import { createPlugin } from '../utils/PluginsUtils';
import {toggleControl} from '../actions/controls';
import {mapSaved as resetMapSaveError} from '../actions/config';
import SaveBaseDialog from './maps/MapSave';

const showMapSaveAsSelector = state => state.controls && state.controls.mapSaveAs && state.controls.mapSaveAs.enabled;

export default createPlugin('SaveAs', {
    component: compose(
        connect(createSelector(
            showMapSaveAsSelector,
            mapInfoSelector,
            (show, resource) => {
                const {id, attributes, name, description, ...others} = resource || {};
                return {show, resource: others};
            }),
=======
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';

import React from 'react';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import assign from 'object-assign';
import { Glyphicon } from 'react-bootstrap';
import Message from '../components/I18N/Message';
import MetadataModal from '../components/maps/modals/MetadataModal';
import { saveMapResource, createThumbnail, onDisplayMetadataEdit, metadataChanged } from '../actions/maps';
import { editMap, updateCurrentMap, errorCurrentMap, resetCurrentMap } from '../actions/currentMap';
import { mapSelector } from '../selectors/map';
import { layersSelector, groupsSelector } from '../selectors/layers';
import { mapOptionsToSaveSelector } from '../selectors/mapsave';
import { mapTypeSelector } from '../selectors/maptype';
import { indexOf } from 'lodash';
import uuid from 'uuid/v1';
import MapUtils from '../utils/MapUtils';

const saveAsStateSelector = createStructuredSelector({
    show: state => state.controls && state.controls.saveAs && state.controls.saveAs.enabled,
    mapType: state => mapTypeSelector(state),
    user: state => state.security && state.security.user,
    currentMap: state => state.currentMap,
    metadata: state => state.maps.metadata,
    textSearchConfig: state => state.searchconfig && state.searchconfig.textSearchConfig
});

const selector = createSelector(
    mapSelector,
    layersSelector,
    groupsSelector,
    mapOptionsToSaveSelector,
    saveAsStateSelector,
    (map, layers, groups, additionalOptions, saveAsState) => ({
        currentZoomLvl: map && map.zoom,
        map,
        layers,
        groups,
        additionalOptions,
        ...saveAsState
    }));

class SaveAs extends React.Component {
    static propTypes = {
        additionalOptions: PropTypes.object,
        show: PropTypes.bool,
        map: PropTypes.object,
        user: PropTypes.object,
        mapType: PropTypes.string,
        layers: PropTypes.array,
        groups: PropTypes.array,
        params: PropTypes.object,
        metadata: PropTypes.object,
        currentMap: PropTypes.object,
        // CALLBACKS
        onClose: PropTypes.func,
        onCreateThumbnail: PropTypes.func,
        onUpdateCurrentMap: PropTypes.func,
        onErrorCurrentMap: PropTypes.func,
        onResetCurrentMap: PropTypes.func,
        onDisplayMetadataEdit: PropTypes.func,
        onSave: PropTypes.func,
        editMap: PropTypes.func,
        resetCurrentMap: PropTypes.func,
        metadataChanged: PropTypes.func,
        onMapSave: PropTypes.func,
        textSearchConfig: PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object
    };

    static defaultProps = {
        additionalOptions: {},
        onMapSave: () => {},
        onDisplayMetadataEdit: () => {},
        show: false
    };

    state = {
        displayMetadataEdit: false
    };

    UNSAFE_componentWillMount() {
        this.onMissingInfo(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.onMissingInfo(nextProps);
    }

    onMissingInfo = (nextProps) => {
        const map = nextProps.map;
        if (map && nextProps.currentMap.mapId && this.props.currentMap.mapId !== nextProps.currentMap.mapId) {
            this.context.router.history.push("/viewer/" + nextProps.mapType + "/" + nextProps.currentMap.mapId);
            this.props.resetCurrentMap();
        }
    };

    render() {
        let map = this.state && this.state.loading ? assign({updating: true}, this.props.currentMap) : this.props.currentMap;
        return (
            <MetadataModal ref="metadataModal"
                metadataChanged={this.props.metadataChanged}
                metadata={this.props.metadata}
                displayPermissionEditor={false}
                showDetailsRow={false}
                modalSize="sm"
                show={this.props.currentMap.displayMetadataEdit}
                onEdit={this.props.editMap}
                onUpdateCurrentMap={this.props.onUpdateCurrentMap}
                onErrorCurrentMap={this.props.onErrorCurrentMap}
                onHide={this.close}
                map={map}
                onDisplayMetadataEdit={this.props.onDisplayMetadataEdit}
                onResetCurrentMap={this.props.resetCurrentMap}
                onSave={this.saveMap}
            />
        );
    }

    close = () => {
        this.props.onUpdateCurrentMap([], this.props.map && this.props.map.thumbnail);
        this.props.onErrorCurrentMap([], this.props.map && this.props.map.id);
        this.props.onClose();
    };

    // this method creates the content for the Map Resource
    createV2Map = () => {
        return MapUtils.saveMapConfiguration(this.props.map, this.props.layers, this.props.groups, this.props.textSearchConfig, this.props.additionalOptions);
    };

    saveMap = (id, name, description) => {
        this.props.editMap(this.props.currentMap);
        let thumbComponent = this.refs.metadataModal.refs.thumbnail;
        let attributes = {"owner": this.props.user && this.props.user.name || null};
        let metadata = {
            name,
            description,
            attributes
        };
        if (metadata.name !== "") {
            thumbComponent.getThumbnailDataUri( (data) => {
                this.props.onMapSave({category: "MAP", data: this.createV2Map(), metadata, linkedResources: data && {thumbnail: {
                    data,
                    category: "THUMBNAIL",
                    name: thumbComponent.generateUUID(),
                    tail: `/raw?decode=datauri&v=${uuid()}`
                }} || {}});
            });
        }
    };
}


export default {
    SaveAsPlugin: connect(selector,
>>>>>>> 11e10c47b... Miration to es6 import export until this commit in master
        {
            onClose: toggleControl.bind(null, 'mapSaveAs', false),
            onResetMapSaveError: resetMapSaveError
        }),
        withProps({
            isMapSaveAs: true
        }))(SaveBaseDialog),
    containers: {
        BurgerMenu: {
            name: 'saveAs',
            position: 31,
            text: <Message msgId="saveAs"/>,
            icon: <Glyphicon glyph="floppy-open"/>,
            action: toggleControl.bind(null, 'mapSaveAs', null),
            // display the BurgerMenu button only if the map can be edited
            selector: (state) => {
                if (state && state.controls && state.controls.saveAs && state.controls.saveAs.allowedRoles) {
                    return indexOf(state.controls.saveAs.allowedRoles, state && state.security && state.security.user && state.security.user.role) !== -1 ? {} : { style: {display: "none"} };
                }
                return { style: isLoggedIn(state) ? {} : {display: "none"} };
            }
        }
    }
});
