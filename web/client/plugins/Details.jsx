/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { connect } from 'react-redux';
import assign from 'object-assign';
import { Glyphicon } from 'react-bootstrap';
import Message from '../components/I18N/Message';
import { mapFromIdSelector } from '../selectors/maps';
import { mapIdSelector, mapInfoDetailsUriFromIdSelector } from '../selectors/map';
import { mapLayoutValuesSelector } from '../selectors/maplayout';
import { currentMapDetailsTextSelector } from '../selectors/currentmap';
import { openDetailsPanel, closeDetailsPanel } from '../actions/maps';
import { get } from 'lodash';

/**
 * Details plugin used for fetching details of the map
 * @class
 * @memberof plugins
 */

export default {
    DetailsPlugin: connect((state) => ({
        active: get(state, "controls.details.enabled"),
        map: mapFromIdSelector(state, mapIdSelector(state)),
        dockStyle: mapLayoutValuesSelector(state, {height: true}),
        detailsText: currentMapDetailsTextSelector(state)
    }), {
        onClose: closeDetailsPanel
    })(assign(require('../components/details/DetailsPanel'), {
        BurgerMenu: {
            name: 'details',
            position: 1000,
            text: <Message msgId="details.title"/>,
            icon: <Glyphicon glyph="sheet"/>,
            action: openDetailsPanel,
            selector: (state) => {
                const mapId = mapIdSelector(state);
                const detailsUri = mapId && mapInfoDetailsUriFromIdSelector(state, mapId);
                if (detailsUri) {
                    return {};
                }
                return { style: {display: "none"} };
            }
        }
    }))

};
