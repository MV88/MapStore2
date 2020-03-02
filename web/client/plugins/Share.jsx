/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { get } from 'lodash';
import assign from 'object-assign';
import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { createSelector } from 'reselect';

import { setControlProperty, toggleControl } from '../actions/controls';
import Message from '../components/I18N/Message';
import SharePanel from '../components/share/SharePanel';
<<<<<<< HEAD
import { createSelector } from 'reselect';
import { mapSelector } from '../selectors/map';
import { currentContextSelector } from '../selectors/context';
import { reprojectBbox, getViewportGeometry } from '../utils/CoordinatesUtils';
import { get } from 'lodash';
=======
import * as shareEpics from '../epics/queryparams';
>>>>>>> 11e10c47b... Miration to es6 import export until this commit in master
import controls from '../reducers/controls';
import { mapSelector } from '../selectors/map';
import { versionSelector } from '../selectors/version';
import ConfigUtils from '../utils/ConfigUtils';
import { getViewportGeometry, reprojectBbox } from '../utils/CoordinatesUtils';
import { connect } from '../utils/PluginsUtils';
import {
    getApiUrl,
    getConfigUrl
} from '../utils/ShareUtils';

/**
 * Get wider and valid extent in viewport
 * @private
 * @param bbox {object} viewport bbox
 * @param bbox.bounds {object} bounds of bbox {minx, miny, maxx, maxy}
 * @param bbox.crs {string} bbox crs
 * @param dest {string} SRS of the returned extent
 * @return {array} [ minx, miny, maxx, maxy ]
*/
const getExtentFromViewport = ({ bounds, crs } = {}, dest = 'EPSG:4326') => {
    if (!bounds || !crs) return null;
    const { extent } = getViewportGeometry(bounds, crs);
    if (extent.length === 4) {
        return reprojectBbox(extent, crs, dest);
    }
    const [ rightExtentWidth, leftExtentWidth ] = extent.map((bbox) => bbox[2] - bbox[0]);
    return rightExtentWidth > leftExtentWidth
        ? reprojectBbox(extent[0], crs, dest)
        : reprojectBbox(extent[1], crs, dest);
};

/**
 * Share Plugin allows to share the current URL (location.href) in some different ways.
 * You can share it on socials networks(facebook,twitter,google+,linkedin)
 * copying the direct link
 * copying the embedded code
 * using the QR code with mobile apps
 * @class
 * @memberof plugins
 * @prop {node} [title] the title of the page
 * @prop {string} [shareUrlRegex] reqular expression to parse the shareUrl to generate the final url, using shareUrlReplaceString
 * @prop {string} [shareUrlReplaceString] expression to be replaced by groups of the shareUrlRegex to get the final shareUrl to use for the iframe
 * @prop {object} [embedOptions] options for the iframe version of embedded share options
 * @prop {boolean} [embedOptions.showTOCToggle] true by default, set to false to hide the "show TOC" toggle.
 * @prop {boolean} [showAPI] default true, if false, hides the API entry of embed.
 * @prop {function} [onClose] function to call on close window event.
 * @prop {function} [getCount] function used to get the count for social links.
 * @prop {object} [advancedSettings] show advanced settings (bbox param or home button) f.e {bbox: true, homeButton: true}
 */

const Share = connect(createSelector([
    state => state.controls && state.controls.share && state.controls.share.enabled,
    versionSelector,
    mapSelector,
    currentContextSelector,
    state => get(state, 'controls.share.settings', {})
], (isVisible, version, map, context, settings) => ({
    isVisible,
    shareUrl: location.href,
    shareApiUrl: getApiUrl(location.href),
    shareConfigUrl: getConfigUrl(location.href, ConfigUtils.getConfigProp('geoStoreUrl')),
    version,
    bbox: isVisible && map && map.bbox && getExtentFromViewport(map.bbox),
    showAPI: !context,
    embedOptions: {
        showTOCToggle: !context
    },
    settings
})), {
    onClose: toggleControl.bind(null, 'share', null),
    onUpdateSettings: setControlProperty.bind(null, 'share', 'settings')
})(SharePanel);

export const reducers = { controls };
export const epics = shareEpics;

export const SharePlugin = assign(Share, {
    disablePluginIf: "{state('router') && (state('router').endsWith('new') || state('router').includes('newgeostory'))}",
    BurgerMenu: {
        name: 'share',
        position: 1000,
        text: <Message msgId="share.title"/>,
        icon: <Glyphicon glyph="share-alt"/>,
        action: toggleControl.bind(null, 'share', null)
    },
    reducers,
    epics
});

export default {
    SharePlugin: SharePlugin,
    reducers,
    epics
};
