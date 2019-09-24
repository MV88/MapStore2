/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";

import { MediaTypes, defaultLayerMapPreview } from '../../../utils/GeoStoryUtils';
import emptyState from '../../misc/enhancers/emptyState';
import PreviewMap from '../../widgets/builder/wizard/map/PreviewMap';
import { isEmpty, merge } from 'lodash';
// TODO MOVE TO UTILS (SHARED WITH PREVIEW)
const DEFAULT_OPTIONS = {
    zoomControl: true,
    style: {width: "100%", height: "100%"},
    mapOptions: {
        interactions: {
            mouseWheelZoom: false
        }
    }
};
// TODO MOVE TO UTILS (SHARED WITH PREVIEW)
const applyDefaults = (options = {}) => merge({}, options, DEFAULT_OPTIONS);

const Preview = ({
    selectedItem
}) => {
    const { layers = [], mapOptions, ...m} = selectedItem; // remove mapOptions to not override options
    return (
        <PreviewMap
            styleMap={{height: "100%"}}
            map={{...m, id: "map" + m.id}}
            id={"preview" + selectedItem.id}
            layers={layers || [defaultLayerMapPreview]}
            options={applyDefaults({})}
        />
    );
};


export default emptyState(
    ( {mediaType, selectedItem}) => mediaType === MediaTypes.MAP && (!selectedItem || isEmpty(selectedItem)),
    {
        iconFit: true,
        glyph: "1-map"
    }
)(Preview);
