/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assign from 'object-assign';
import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';

import { toggleControl } from '../actions/controls';
import { addLayer } from '../actions/layers';
import { zoomToExtent } from '../actions/map';
import {
    onError, setLoading, setLayers, onSelectLayer, onLayerAdded, onLayerSkipped, updateBBox, onSuccess
} from '../actions/mapimport';
import mapimport from '../reducers/mapimport';
import style from  '../reducers/style';
import { mapTypeSelector } from '../selectors/maptype';
import Message from './locale/Message';

export default {
    MapImportPlugin: assign({loadPlugin: (resolve) => {
        require.ensure(['./import/Import'], () => {
            const Import = require('./import/Import');

            const ImportPlugin = connect((state) => (
                {
                    enabled: state.controls && state.controls.mapimport && state.controls.mapimport.enabled,
                    layers: state.mapimport && state.mapimport.layers || null,
                    selected: state.mapimport && state.mapimport.selected || null,
                    bbox: state.mapimport && state.mapimport.bbox || null,
                    success: state.mapimport && state.mapimport.success || null,
                    errors: state.mapimport && state.mapimport.errors || null,
                    shapeStyle: state.style || {},
                    mapType: mapTypeSelector(state)
                }
            ), {
                setLayers,
                onLayerAdded,
                onLayerSkipped,
                onSelectLayer,
                onError,
                onSuccess,
                addLayer,
                onZoomSelected: zoomToExtent,
                updateBBox,
                setLoading,
                onClose: toggleControl.bind(null, 'mapimport', null)
            })(Import);

            resolve(ImportPlugin);
        });
    }, enabler: (state) => state.mapimport && state.mapimport.enabled || state.toolbar && state.toolbar.active === 'import'}, {
        disablePluginIf: "{state('mapType') === 'cesium'}",
        BurgerMenu: {
            name: 'import',
            position: 4,
            text: <Message msgId="mapImport.title"/>,
            icon: <Glyphicon glyph="upload"/>,
            action: toggleControl.bind(null, 'mapimport', null),
            priority: 2,
            doNotHide: true
        }
    }),
    reducers: {
        mapimport,
        style
    }
};
