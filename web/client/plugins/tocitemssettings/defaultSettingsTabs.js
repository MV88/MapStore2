/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Message from '../../components/I18N/Message';
import { defaultProps } from 'recompose';
import { Glyphicon } from 'react-bootstrap';
import assign from 'object-assign';
import HTMLViewer from '../../components/data/identify/viewers/HTMLViewer';
import TextViewer from '../../components/data/identify/viewers/TextViewer';
import JSONViewer from '../../components/data/identify/viewers/JSONViewer';
import HtmlRenderer from '../../components/misc/HtmlRenderer';
import MapInfoUtils from '../../utils/MapInfoUtils';
import PluginsUtils from '../../utils/PluginsUtils';
import General from '../../components/TOC/fragments/settings/General';
import Display from '../../components/TOC/fragments/settings/Display';
import Elevation from '../../components/TOC/fragments/settings/Elevation';
import FeatureInfoEditor from '../../components/TOC/fragments/settings/FeatureInfoEditor';
import LoadingView from '../../components/misc/LoadingView';
import html from 'raw-loader!./featureInfoPreviews/responseHTML.txt';
import text from 'raw-loader!./featureInfoPreviews/responseText.txt';

const responses = {
    html,
    json: JSON.parse(require('raw-loader!./featureInfoPreviews/responseJSON.txt')),
    text
};

import { StyleSelector } from '../styleeditor/index';
const StyleList = defaultProps({ readOnly: true })(StyleSelector);

const formatCards = {
    TEXT: {
        titleId: 'layerProperties.textFormatTitle',
        descId: 'layerProperties.textFormatDescription',
        glyph: 'ext-txt',
        body: () => (
            <div>
                <div><Message msgId="layerProperties.exampleOfResponse"/></div>
                <br/>
                <TextViewer response={responses.text}/>
            </div>
        )
    },
    HTML: {
        titleId: 'layerProperties.htmlFormatTitle',
        descId: 'layerProperties.htmlFormatDescription',
        glyph: 'ext-html',
        body: () => (
            <div>
                <div><Message msgId="layerProperties.exampleOfResponse"/></div>
                <br/>
                <HTMLViewer response={responses.html}/>
            </div>
        )
    },
    PROPERTIES: {
        titleId: 'layerProperties.propertiesFormatTitle',
        descId: 'layerProperties.propertiesFormatDescription',
        glyph: 'ext-json',
        body: () => (
            <div>
                <div><Message msgId="layerProperties.exampleOfResponse"/></div>
                <br/>
                <JSONViewer response={responses.json} />
            </div>
        )
    },
    TEMPLATE: {
        titleId: 'layerProperties.templateFormatTitle',
        descId: 'layerProperties.templateFormatDescription',
        glyph: 'ext-empty',
        body: ({template = '', ...props}) => (
            <div>
                <div>{template && template !== '<p><br></p>' ? <Message msgId="layerProperties.templatePreview"/> : null}</div>
                <br/>
                <div>
                    {template && template !== '<p><br></p>' ?
                        <HtmlRenderer html={template}/>
                        :
                        <span>
                            <p><Message msgId="layerProperties.templateFormatInfoAlert2" msgParams={{ attribute: '{ }'}}/></p>
                            <pre>
                                <Message msgId="layerProperties.templateFormatInfoAlertExample" msgParams={{ properties: '{ properties.id }' }}/>
                            </pre>
                            <p><small><Message msgId="layerProperties.templateFormatInfoAlert1"/></small>&nbsp;(&nbsp;<Glyphicon glyph="pencil"/>&nbsp;)</p>
                        </span>}
                    <FeatureInfoEditor template={template} {...props}/>
                </div>
            </div>
        )
    }
};

const FeatureInfo = defaultProps({
    formatCards,
    defaultInfoFormat: MapInfoUtils.getAvailableInfoFormat()
})(require('../../components/TOC/fragments/settings/FeatureInfo'));

const configuredPlugins = {};

const getConfiguredPlugin = (plugin, loaded, loadingComp) => {
    if (plugin) {
        let configured = configuredPlugins[plugin.name];
        if (!configured) {
            configured = PluginsUtils.getConfiguredPlugin(plugin, loaded, loadingComp);
            if (configured && configured.loaded) {
                configuredPlugins[plugin.name] = configured;
            }
        }
        return configured;
    }
    return plugin;
};

let settingsPlugins;

export default ({showFeatureInfoTab = true, ...props}, {plugins, pluginsConfig, loadedPlugins}) => {
    if (!settingsPlugins) {
        settingsPlugins = assign({}, (PluginsUtils.getPluginItems({}, plugins, pluginsConfig, "TOC", props.id, true, loadedPlugins, (p) => p.container === 'TOCItemSettings') || [])
            .reduce((previous, p) => ({...previous, [p.name]: p}), {}));
    }

    return [
        {
            id: 'general',
            titleId: 'layerProperties.general',
            tooltipId: 'layerProperties.general',
            glyph: 'wrench',
            visible: true,
            Component: General
        },
        {
            id: 'display',
            titleId: 'layerProperties.display',
            tooltipId: 'layerProperties.display',
            glyph: 'eye-open',
            visible: props.settings.nodeType === 'layers',
            Component: Display
        },
        {
            id: 'style',
            titleId: 'layerProperties.style',
            tooltipId: 'layerProperties.style',
            glyph: 'dropper',
            onClose: () => settingsPlugins && settingsPlugins.StyleEditor && props.onToggleStyleEditor && props.onToggleStyleEditor(null, false),
            onClick: () => settingsPlugins && settingsPlugins.StyleEditor && props.onToggleStyleEditor && props.onToggleStyleEditor(null, true),
            visible: props.settings.nodeType === 'layers' && props.element.type === "wms",
            Component: props.activeTab === 'style' && props.settings.options.thematic && settingsPlugins.ThematicLayer && getConfiguredPlugin(settingsPlugins.ThematicLayer, loadedPlugins, <LoadingView width={100} height={100} />)
            || settingsPlugins.StyleEditor && getConfiguredPlugin({...settingsPlugins.StyleEditor, cfg: {...settingsPlugins.StyleEditor.cfg, active: true }}, loadedPlugins, <LoadingView width={100} height={100} />)
            || StyleList,
            toolbar: [
                {
                    glyph: 'list',
                    tooltipId: 'toc.thematic.classify',
                    visible: settingsPlugins.ThematicLayer && props.isAdmin && !props.settings.options.thematic && props.element.search || false,
                    onClick: () => props.onUpdateParams && props.onUpdateParams({
                        thematic: {
                            unconfigured: true
                        }
                    })
                },
                {
                    glyph: 'trash',
                    tooltipId: 'toc.thematic.remove_thematic',
                    visible: settingsPlugins.ThematicLayer && props.isAdmin && props.settings.options.thematic || false,
                    onClick: () => props.onUpdateParams && props.onUpdateParams({
                        thematic: null
                    })
                }
            ],
            toolbarComponent: settingsPlugins && settingsPlugins.StyleEditor && settingsPlugins.StyleEditor.ToolbarComponent &&
                (
                    settingsPlugins.StyleEditor.cfg && defaultProps(settingsPlugins.StyleEditor.cfg)(settingsPlugins.StyleEditor.ToolbarComponent)
                    || settingsPlugins.StyleEditor.ToolbarComponent
                )
        },
        {
            id: 'feature',
            titleId: 'layerProperties.featureInfo',
            tooltipId: 'layerProperties.featureInfo',
            glyph: 'map-marker',
            visible: showFeatureInfoTab && props.settings.nodeType === 'layers' && props.element.type === "wms" && !(props.element.featureInfo && props.element.featureInfo.viewer),
            Component: FeatureInfo,
            toolbar: [
                {
                    glyph: 'pencil',
                    tooltipId: 'layerProperties.editCustomFormat',
                    visible: !props.showEditor && props.element && props.element.featureInfo && props.element.featureInfo.format === 'TEMPLATE' || false,
                    onClick: () => props.onShowEditor && props.onShowEditor(!props.showEditor)
                }
            ]
        },
        {
            id: 'elevation',
            titleId: 'layerProperties.elevation',
            tooltipId: 'layerProperties.elevation',
            glyph: '1-vector',
            visible: props.settings.nodeType === 'layers' && props.element.type === "wms" && props.element.dimensions && props.getDimension && props.getDimension(props.element.dimensions, 'elevation'),
            Component: Elevation
        }
    ].filter(tab => tab.visible);
};
