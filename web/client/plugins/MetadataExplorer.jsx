/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import assign from 'object-assign';
import {createSelector} from "reselect";
import {Glyphicon, Panel} from 'react-bootstrap';
import ContainerDimensions from 'react-container-dimensions';
import {changeLayerProperties} from '../actions/layers';
import {addService, deleteService, textSearch, changeCatalogFormat, changeCatalogMode,
    changeUrl, changeTitle, changeAutoload, changeType, changeServiceFormat, changeSelectedService,
    addLayer, addLayerError, focusServicesList, changeText,
    changeMetadataTemplate, toggleAdvancedSettings, toggleThumbnail, toggleTemplate, catalogClose} from "../actions/catalog";
import {zoomToExtent} from "../actions/map";
import csw from '../api/CSW';
import wms from '../api/WMS';
import wmts from '../api/WMTS';
import mapBackground from '../api/mapBackground';
import {addBackgroundProperties, updateThumbnail, removeThumbnail, clearModalParameters, backgroundAdded} from '../actions/backgroundselector';
import {currentLocaleSelector, currentMessagesSelector} from "../selectors/locale";
import {layersSelector} from '../selectors/layers';
import {setControlProperty, toggleControl} from "../actions/controls";
import {resultSelector, serviceListOpenSelector, newServiceSelector,
    newServiceTypeSelector, selectedServiceTypeSelector, searchOptionsSelector, servicesSelector,
    servicesSelectorWithBackgrounds, formatsSelector, loadingErrorSelector, selectedServiceSelector,
    modeSelector, layerErrorSelector, activeSelector, savingSelector, authkeyParamNameSelector,
    searchTextSelector, groupSelector, pageSizeSelector, loadingSelector, selectedServiceLayerOptionsSelector
} from "../selectors/catalog";
import {projectionSelector} from '../selectors/map';

import {mapLayoutValuesSelector} from '../selectors/maplayout';
import {metadataSourceSelector, modalParamsSelector} from '../selectors/backgroundselector';
import Message from "../components/I18N/Message";
import CatalogComp from '../components/catalog/Catalog';
import DockPanel from "../components/misc/panels/DockPanel";
import CatalogUtils from '../utils/CatalogUtils';

import('./metadataexplorer/css/style.css');

import catalog from '../reducers/catalog';
import epics from '../epics/catalog';

const catalogSelector = createSelector([
    (state) => layersSelector(state),
    (state) => modalParamsSelector(state),
    (state) => authkeyParamNameSelector(state),
    (state) => resultSelector(state),
    (state) => savingSelector(state),
    (state) => serviceListOpenSelector(state),
    (state) => newServiceSelector(state),
    (state) => newServiceTypeSelector(state),
    (state) => selectedServiceTypeSelector(state),
    (state) => searchOptionsSelector(state),
    (state) => selectedServiceLayerOptionsSelector(state),
    (state) => currentLocaleSelector(state),
    (state) => currentMessagesSelector(state),
    (state) => pageSizeSelector(state),
    (state) => loadingSelector(state),
    (state) => projectionSelector(state)
], (layers, modalParams, authkeyParamNames, result, saving, openCatalogServiceList, newService, newformat, selectedFormat, options, layerOptions, currentLocale, locales, pageSize, loading, crs) => ({
    layers,
    modalParams,
    authkeyParamNames,
    saving,
    openCatalogServiceList,
    format: newformat,
    newService,
    currentLocale,
    pageSize,
    loading,
    crs,
    records: result && CatalogUtils.getCatalogRecords(selectedFormat, result, { ...options, layerOptions }, locales) || []
}));


const Catalog = connect(catalogSelector, {
    // add layer action to pass to the layers
    onUpdateThumbnail: updateThumbnail,
    onAddBackgroundProperties: addBackgroundProperties,
    onZoomToExtent: zoomToExtent,
    onFocusServicesList: focusServicesList,
    onPropertiesChange: changeLayerProperties,
    onAddBackground: backgroundAdded,
    removeThumbnail,
    onToggle: toggleControl.bind(null, 'backgroundSelector', null),
    onLayerChange: setControlProperty.bind(null, 'backgroundSelector'),
    onStartChange: setControlProperty.bind(null, 'backgroundSelector', 'start')
})(CatalogComp);


class MetadataExplorerComponent extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        source: PropTypes.string,
        active: PropTypes.bool,
        searchOnStartup: PropTypes.bool,
        formats: PropTypes.array,
        wrap: PropTypes.bool,
        wrapWithPanel: PropTypes.bool,
        panelStyle: PropTypes.object,
        panelClassName: PropTypes.string,
        toggleControl: PropTypes.func,
        closeGlyph: PropTypes.string,
        buttonStyle: PropTypes.object,
        services: PropTypes.object,
        servicesWithBackgrounds: PropTypes.object,
        selectedService: PropTypes.string,
        style: PropTypes.object,
        dockProps: PropTypes.object,
        zoomToLayer: PropTypes.bool,

        // side panel properties
        width: PropTypes.number,
        dockStyle: PropTypes.object,
        group: PropTypes.string
    };

    static defaultProps = {
        id: "mapstore-metadata-explorer",
        active: false,
        wrap: false,
        modal: true,
        wrapWithPanel: false,
        panelStyle: {
            zIndex: 100,
            overflow: "hidden",
            height: "100%"
        },
        panelClassName: "catalog-panel",
        toggleControl: () => {},
        closeGlyph: "1-close",
        zoomToLayer: true,

        // side panel properties
        width: 660,
        dockProps: {
            dimMode: "none",
            fluid: false,
            position: "right",
            zIndex: 1030
        },
        dockStyle: {},
        group: null,
        services: {},
        servicesWithBackgrounds: {}
    };

    render() {
        const layerBaseConfig = {
            group: this.props.group || undefined
        };
        const panel = (
            <Catalog
                layerBaseConfig={layerBaseConfig}
                zoomToLayer={this.props.zoomToLayer}
                searchOnStartup={this.props.searchOnStartup}
                active={this.props.active}
                {...this.props}
                services={this.props.source === 'backgroundSelector' ? this.props.servicesWithBackgrounds : this.props.services}
                servicesWithBackgrounds={undefined}
            />
        );
        return (
            <div id="catalog-root" className={this.props.active ? 'catalog-active' : ''} style={{width: '100%', height: '100%', pointerEvents: 'none'}}>
                <ContainerDimensions>
                    {({ width }) => (<DockPanel
                        open={this.props.active}
                        size={this.props.width / width > 1 ? width : this.props.width}
                        position="right"
                        bsStyle="primary"
                        title={<Message msgId="catalog.title"/>}
                        onClose={() => this.props.toggleControl()}
                        glyph="folder-open"
                        style={this.props.dockStyle}
                        noResize>
                        <Panel id={this.props.id} style={this.props.panelStyle} className={this.props.panelClassName}>
                            {panel}
                        </Panel>
                    </DockPanel>)}
                </ContainerDimensions>
            </div>
        );
    }
}

const metadataExplorerSelector = createSelector([
    searchOptionsSelector,
    formatsSelector,
    resultSelector,
    loadingErrorSelector,
    selectedServiceSelector,
    modeSelector,
    servicesSelector,
    servicesSelectorWithBackgrounds,
    layerErrorSelector,
    activeSelector,
    state => mapLayoutValuesSelector(state, {height: true}),
    searchTextSelector,
    groupSelector,
    metadataSourceSelector
], (searchOptions, formats, result, loadingError, selectedService, mode, services, servicesWithBackgrounds, layerError, active, dockStyle, searchText, group, source) => ({
    searchOptions,
    formats,
    result,
    loadingError,
    selectedService,
    mode, services, servicesWithBackgrounds,
    layerError,
    active,
    dockStyle,
    searchText,
    group,
    source
}));

const MetadataExplorerPlugin = connect(metadataExplorerSelector, {
    clearModal: clearModalParameters,
    onSearch: textSearch,
    onLayerAdd: addLayer,
    toggleControl: catalogClose,
    onChangeFormat: changeCatalogFormat,
    onChangeServiceFormat: changeServiceFormat,
    onChangeUrl: changeUrl,
    onChangeType: changeType,
    onChangeTitle: changeTitle,
    onChangeMetadataTemplate: changeMetadataTemplate,
    onChangeText: changeText,
    onChangeAutoload: changeAutoload,
    onChangeSelectedService: changeSelectedService,
    onChangeCatalogMode: changeCatalogMode,
    onAddService: addService,
    onToggleAdvancedSettings: toggleAdvancedSettings,
    onToggleThumbnail: toggleThumbnail,
    onToggleTemplate: toggleTemplate,
    onDeleteService: deleteService,
    onError: addLayerError
})(MetadataExplorerComponent);

const API = {
    csw,
    wms,
    wmts,
    backgrounds: mapBackground
};
/**
 * MetadataExplorer (Catalog) plugin. Shows the catalogs results (CSW, WMS and WMTS).
 * Some useful flags in `localConfig.json`:
 * - `noCreditsFromCatalog`: avoid add credits (attribution) from catalog
 *
 * @class
 * @name MetadataExplorer
 * @memberof plugins
 * @prop {string} cfg.hideThumbnail shows/hides thumbnail
 * @prop {object} cfg.hideIdentifier shows/hides identifier
 * @prop {boolean} cfg.hideExpand shows/hides full description button
 * @prop {number} cfg.zoomToLayer enable/disable zoom to layer when added
 * @prop {number} [delayAutoSearch] time in ms passed after a search is triggered by filter changes, default 1000
 */
export default {
    MetadataExplorerPlugin: assign(MetadataExplorerPlugin, {
        BurgerMenu: {
            name: 'metadataexplorer',
            position: 5,
            text: <Message msgId="catalog.title"/>,
            icon: <Glyphicon glyph="folder-open"/>,
            action: setControlProperty.bind(null, "metadataexplorer", "enabled", true, true),
            doNotHide: true
        },
        BackgroundSelector: {
            name: 'MetadataExplorer',
            doNotHide: true
        },
        TOC: {
            name: 'MetadataExplorer',
            doNotHide: true
        }
    }),
    reducers: {catalog},
    epics: epics(API)
};
