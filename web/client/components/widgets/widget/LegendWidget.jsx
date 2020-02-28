/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import emptyLegendState from '../enhancers/emptyLegendState';
import LegendView from './LegendView';
import WidgetContainer from './WidgetContainer';

const LegendWidget = emptyLegendState()(LegendView);

export default ({
    toggleDeleteConfirm = () => {},
    id, title,
    icons,
    headerStyle,
    confirmDelete = false,
    topRightItems,
    onDelete = () => {},
    ...props
} = {}) =>
    (<WidgetContainer id={`widget-text-${id}`} title={title} confirmDelete={confirmDelete} onDelete={onDelete} toggleDeleteConfirm={toggleDeleteConfirm} headerStyle={headerStyle}
        icons={icons}
        topRightItems={topRightItems}
    >
        <LegendWidget {...props} />
    </WidgetContainer>

    );
