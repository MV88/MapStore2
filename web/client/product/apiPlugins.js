/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ReactSwipe from 'react-swipeable-views';

import SwipeHeader from '../components/data/identify/SwipeHeader';
import BackgroundSwitcherPlugin from '../plugins/BackgroundSwitcher';
import DrawerMenuPlugin from '../plugins/DrawerMenu';
import FeedbackMaskPlugin from '../plugins/FeedbackMask';
import GoFullPlugin from '../plugins/GoFull';
import IdentifyPlugin from '../plugins/Identify';
import LocatePlugin from '../plugins/Locate';
import MapPlugin from '../plugins/Map';
import MapFooterPlugin from '../plugins/MapFooter';
import MapLoadingPlugin from '../plugins/MapLoading';
import OmniBarPlugin from '../plugins/OmniBar';
import SearchPlugin from '../plugins/Search';
import TOCPlugin from '../plugins/TOC';
import ToolbarPlugin from '../plugins/Toolbar';
import ZoomAllPlugin from '../plugins/ZoomAll';

export default {
    plugins: {
        // framework plugins
        BackgroundSwitcherPlugin,
        DrawerMenuPlugin,
        FeedbackMaskPlugin,
        GoFullPlugin,
        IdentifyPlugin,
        LocatePlugin,
        MapFooterPlugin,
        MapLoadingPlugin,
        MapPlugin,
        OmniBarPlugin,
        SearchPlugin,
        TOCPlugin,
        ToolbarPlugin,
        ZoomAllPlugin
    },
    requires: {
        ReactSwipe,
        SwipeHeader
    }
};
