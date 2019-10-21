/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { connect } from 'react-redux';

import { createSelector } from 'reselect';
import { layersSelector } from '../selectors/layers';
import assign from 'object-assign';

const selector = createSelector([layersSelector], (layers) => ({
    loading: layers && layers.some((layer) => layer.loading)
}));

import './maploading/maploading.css';

const MapLoadingPlugin = connect(selector)(require('../components/misc/spinners/GlobalSpinner/GlobalSpinner'));

export default {
    MapLoadingPlugin: assign(MapLoadingPlugin, {
        Toolbar: {
            name: 'maploading',
            position: 1,
            tool: true,
            priority: 1
        }
    }),
    reducers: {}
};
