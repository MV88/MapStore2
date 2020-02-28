/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
import { omit } from 'lodash';
import React from 'react';
import { withHandlers } from 'recompose';

import MapViewComp from './MapView';
import WidgetContainer from './WidgetContainer';

const MapView = withHandlers({
    onMapViewChanges: ({ updateProperty = () => { } }) => map => updateProperty('map', map)
})(MapViewComp);


export default ({
    updateProperty = () => { },
    toggleDeleteConfirm = () => { },
    id, title,
    map,
    icons,
    mapStateSource,
    topRightItems,
    confirmDelete = false,
    onDelete = () => {},
    headerStyle
} = {}) =>
    (<WidgetContainer id={`widget-text-${id}`} title={title} confirmDelete={confirmDelete} onDelete={onDelete} toggleDeleteConfirm={toggleDeleteConfirm} headerStyle={headerStyle}
        icons={icons}
        topRightItems={topRightItems}
    >
        <MapView updateProperty={updateProperty} id={id} map={omit(map, 'mapStateSource')} mapStateSource={mapStateSource} layers={map && map.layers} options={{ style: { margin: 10, height: 'calc(100% - 20px)' }}}/>
    </WidgetContainer>);
