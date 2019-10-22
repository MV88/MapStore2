/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
  * Please, keep them sorted alphabetically
 */
import ReactSwipe from 'react-swipeable-views';

import SwipeHeader from '../components/data/identify/SwipeHeader';

// product plugins
import AboutPlugin from './plugins/About';
import AttributionPlugin from './plugins/Attribution';
import ExamplesPlugin from './plugins/Examples';
import FooterPlugin from './plugins/Footer';
import ForkPlugin from './plugins/Fork';
import HeaderPlugin from './plugins/Header';
import HomeDescriptionPlugin from './plugins/HomeDescription';
import MadeWithLovePlugin from './plugins/MadeWithLove';
import MailingListsPlugin from './plugins/MailingLists';
import MapTypePlugin from './plugins/MapType';
import NavMenu from './plugins/NavMenu';
// framework plugins
import AddGroupPlugin from '../plugins/AddGroup';
import AnnotationsPlugin from '../plugins/Annotations';
import AutoMapUpdatePlugin from '../plugins/AutoMapUpdate';
import BackgroundSelectorPlugin from '../plugins/BackgroundSelector';
import BackgroundSwitcherPlugin from '../plugins/BackgroundSwitcher';
import BurgerMenuPlugin from '../plugins/BurgerMenu';
import CRSSelectorPlugin from '../plugins/CRSSelector';
import ContentTabs from '../plugins/ContentTabs';
import CookiePlugin from '../plugins/Cookie';
import CreateNewMapPlugin from '../plugins/CreateNewMap';
import Dashboard from '../plugins/Dashboard';
import DashboardEditor from '../plugins/DashboardEditor';
import DashboardsPlugin from '../plugins/Dashboards';
import DetailsPlugin from '../plugins/Details';
import DrawerMenuPlugin from '../plugins/DrawerMenu';
import ExpanderPlugin from '../plugins/Expander';
import FeatureEditorPlugin from '../plugins/FeatureEditor';
import FeaturedMaps from '../plugins/FeaturedMaps';
import FeedbackMaskPlugin from '../plugins/FeedbackMask';
import FloatingLegendPlugin from '../plugins/FloatingLegend';
import FullScreenPlugin from '../plugins/FullScreen';
import GeoStoriesPlugin from '../plugins/GeoStories';
import GeoStoryPlugin from '../plugins/GeoStory';
import GeoStoryEditorPlugin from '../plugins/GeoStoryEditor';
import GeoStoryNavigationPlugin from '../plugins/GeoStoryNavigation';
import SaveStoryPlugin from '../plugins/GeoStorySave';
import {GeoStorySaveAs as GeoStorySaveAsPlugin}  from '../plugins/GeoStorySave';
import {GeoStorySave as GeoStorySavePlugin} from '../plugins/GeoStorySave';
import GlobeViewSwitcherPlugin from '../plugins/GlobeViewSwitcher';
import GoFull from '../plugins/GoFull';
import GridContainerPlugin from '../plugins/GridContainer';
import HelpPlugin from '../plugins/Help';
import HelpLinkPlugin from '../plugins/HelpLink';
import RedoPlugin from '../plugins/History';
import UndoPlugin from '../plugins/History';
import HomePlugin from '../plugins/Home';
import IdentifyPlugin from '../plugins/Identify';
import LanguagePlugin from '../plugins/Language';
import LocatePlugin from '../plugins/Locate';
import LoginPlugin from '../plugins/Login';
import MapPlugin from '../plugins/Map';
import MapExportPlugin from '../plugins/MapExport';
import MapFooterPlugin from '../plugins/MapFooter';
import MapImportPlugin from '../plugins/MapImport';
import MapLoadingPlugin from '../plugins/MapLoading';
import MapSearchPlugin from '../plugins/MapSearch';
import MapsPlugin from '../plugins/Maps';
import MeasurePlugin from '../plugins/Measure';
import MediaEditorPlugin from '../plugins/MediaEditor';
import MetadataExplorerPlugin from '../plugins/MetadataExplorer';
import MousePositionPlugin from '../plugins/MousePosition';
import NotificationsPlugin from '../plugins/Notifications';
import OmniBarPlugin from '../plugins/OmniBar';
import PlaybackPlugin from '../plugins/Playback.jsx';
import PrintPlugin from '../plugins/Print';
import QueryPanelPlugin from '../plugins/QueryPanel';
import RedirectPlugin from '../plugins/Redirect';
import RulesDataGridPlugin from '../plugins/RulesDataGrid';
import RulesEditorPlugin from '../plugins/RulesEditor';
import RulesManagerFooter from '../plugins/RulesManagerFooter';
import SavePlugin from '../plugins/Save';
import SaveAsPlugin from '../plugins/SaveAs';
import ScaleBoxPlugin from '../plugins/ScaleBox';
import ScrollTopPlugin from '../plugins/ScrollTop';
import SearchPlugin from '../plugins/Search';
import SearchServicesConfigPlugin from '../plugins/SearchServicesConfig';
import SettingsPlugin from '../plugins/Settings';
import SharePlugin from '../plugins/Share';
import SnapshotPlugin from '../plugins/Snapshot';
import StyleEditorPlugin from '../plugins/StyleEditor';
import TOCPlugin from '../plugins/TOC';
import TOCItemsSettingsPlugin from '../plugins/TOCItemsSettings';
import ThematicLayerPlugin from '../plugins/ThematicLayer';
import ThemeSwitcherPlugin from '../plugins/ThemeSwitcher';
import TimelinePlugin from '../plugins/Timeline';
import ToolbarPlugin from '../plugins/Toolbar';
import TutorialPlugin from '../plugins/Tutorial';
import VersionPlugin from '../plugins/Version';
import WFSDownloadPlugin from '../plugins/WFSDownload';
import WidgetsPlugin from '../plugins/Widgets';
import WidgetsBuilderPlugin from '../plugins/WidgetsBuilder';
import WidgetsTrayPlugin from '../plugins/WidgetsTray';
import ZoomAllPlugin from '../plugins/ZoomAll';
import ZoomInPlugin from '../plugins/ZoomIn';
import ZoomOutPlugin from '../plugins/ZoomOut';
import GroupManagerPlugin from '../plugins/manager/GroupManager';
import ManagerPlugin from '../plugins/manager/Manager';
import ManagerMenuPlugin from '../plugins/manager/ManagerMenu';
import UserManagerPlugin from '../plugins/manager/UserManager';

export default {
    plugins: {
        // product plugins
        AboutPlugin,
        AttributionPlugin,
        ExamplesPlugin,
        FooterPlugin,
        ForkPlugin,
        HeaderPlugin,
        HomeDescriptionPlugin,
        MadeWithLovePlugin,
        MailingListsPlugin,
        MapTypePlugin,
        NavMenu,
        // framework plugins
        AddGroupPlugin,
        AnnotationsPlugin,
        AutoMapUpdatePlugin,
        BackgroundSelectorPlugin,
        BackgroundSwitcherPlugin,
        BurgerMenuPlugin,
        CRSSelectorPlugin,
        ContentTabs,
        CookiePlugin,
        CreateNewMapPlugin,
        Dashboard,
        DashboardEditor,
        DashboardsPlugin,
        DetailsPlugin,
        DrawerMenuPlugin,
        ExpanderPlugin,
        FeatureEditorPlugin,
        FeaturedMaps,
        FeedbackMaskPlugin,
        FloatingLegendPlugin,
        FullScreenPlugin,
        GeoStoryPlugin,
        GeoStoriesPlugin,
        GeoStoryEditorPlugin,
        GeoStorySavePlugin,
        GeoStorySaveAsPlugin,
        GeoStoryNavigationPlugin,
        GlobeViewSwitcherPlugin,
        GoFull,
        GridContainerPlugin,
        GroupManagerPlugin,
        HelpLinkPlugin,
        HelpPlugin,
        HomePlugin,
        IdentifyPlugin,
        LanguagePlugin,
        LocatePlugin,
        LoginPlugin,
        ManagerMenuPlugin,
        ManagerPlugin,
        MapExportPlugin,
        MapFooterPlugin,
        MapImportPlugin,
        MapLoadingPlugin,
        MapPlugin,
        MapSearchPlugin,
        MapsPlugin,
        MeasurePlugin,
        MediaEditorPlugin,
        MetadataExplorerPlugin,
        MousePositionPlugin,
        NotificationsPlugin,
        OmniBarPlugin,
        PlaybackPlugin,
        PrintPlugin,
        QueryPanelPlugin,
        RedirectPlugin,
        RedoPlugin,
        RulesDataGridPlugin,
        RulesEditorPlugin,
        RulesManagerFooter,
        SaveAsPlugin,
        SavePlugin,
        SaveStoryPlugin,
        ScaleBoxPlugin,
        ScrollTopPlugin,
        SearchPlugin,
        SearchServicesConfigPlugin,
        SettingsPlugin,
        SharePlugin,
        SnapshotPlugin,
        StyleEditorPlugin,
        TOCItemsSettingsPlugin,
        TOCPlugin,
        ThematicLayerPlugin,
        ThemeSwitcherPlugin,
        TimelinePlugin,
        ToolbarPlugin,
        TutorialPlugin,
        UndoPlugin,
        UserManagerPlugin,
        VersionPlugin,
        WFSDownloadPlugin,
        WidgetsBuilderPlugin,
        WidgetsPlugin,
        WidgetsTrayPlugin,
        ZoomAllPlugin,
        ZoomInPlugin,
        ZoomOutPlugin
    },
    requires: {
        ReactSwipe,
        SwipeHeader
    }
};
