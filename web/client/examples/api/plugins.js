/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import BackgroundSelectorPlugin from '../../plugins/BackgroundSelector';
import BurgerMenuPlugin from '../../plugins/BurgerMenu';
import DrawerMenuPlugin from '../../plugins/DrawerMenu';
import ExpanderPlugin from '../../plugins/Expander';
import HelpPlugin from '../../plugins/Help';
import RedoPlugin from '../../plugins/History';
import UndoPlugin from '../../plugins/History';
import HomePlugin from '../../plugins/Home';
import LanguagePlugin from '../../plugins/Language';
import LocatePlugin from '../../plugins/Locate';
import LoginPlugin from '../../plugins/Login';
import MapPlugin from '../../plugins/Map';
import MapLoadingPlugin from '../../plugins/MapLoading';
import MapSearchPlugin from '../../plugins/MapSearch';
import MapsPlugin from '../../plugins/Maps';
import MeasurePlugin from '../../plugins/Measure';
import MetadataExplorerPlugin from '../../plugins/MetadataExplorer';
import OmniBarPlugin from '../../plugins/OmniBar';
import SavePlugin from '../../plugins/Save';
import SaveAsPlugin from '../../plugins/SaveAs';
import ScaleBoxPlugin from '../../plugins/ScaleBox';
import SearchPlugin from '../../plugins/Search';
import SettingsPlugin from '../../plugins/Settings';
import SharePlugin from '../../plugins/Share';
import SnapshotPlugin from '../../plugins/Snapshot';
import TOCPlugin from '../../plugins/TOC';
import TOCItemsSettingsPlugin from '../../plugins/TOCItemsSettings';
import ToolbarPlugin from '../../plugins/Toolbar';
import ZoomAllPlugin from '../../plugins/ZoomAll';
import ZoomInPlugin from '../../plugins/ZoomIn';
import ZoomOutPlugin from '../../plugins/ZoomOut';
import ManagerPlugin from '../../plugins/manager/Manager';
import ManagerMenuPlugin from '../../plugins/manager/ManagerMenu';
import ManagerMenuPlugin from '../../plugins/manager/ManagerMenu';
import ReactSwipe from 'react-swipeable-views';
import SwipeHeader from '../../components/data/identify/SwipeHeader';

export default {
    plugins: {
        BackgroundSelectorPlugin,
        BurgerMenuPlugin,
        DrawerMenuPlugin,
        ExpanderPlugin,
        HelpPlugin,
        RedoPlugin,
        UndoPlugin,
        HomePlugin,
        LanguagePlugin,
        LocatePlugin,
        LoginPlugin,
        MapPlugin,
        MapLoadingPlugin,
        MapSearchPlugin,
        MapsPlugin,
        MeasurePlugin,
        MetadataExplorerPlugin,
        OmniBarPlugin,
        SavePlugin,
        SaveAsPlugin,
        ScaleBoxPlugin,
        SearchPlugin,
        SettingsPlugin,
        SharePlugin,
        SnapshotPlugin,
        TOCPlugin,
        TOCItemsSettingsPlugin,
        ToolbarPlugin,
        ZoomAllPlugin,
        ZoomInPlugin,
        ZoomOutPlugin,
        ManagerPlugin,
        ManagerMenuPlugin
    },
    requires: {
        ReactSwipe,
        SwipeHeader
    }
};
