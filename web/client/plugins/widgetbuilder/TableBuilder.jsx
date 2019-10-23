/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { get } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { branch, compose, mapPropsStream, renameProps, renderComponent } from 'recompose';

import {
    changeEditorSetting,
    insertWidget,
    onEditorChange,
    openFilterEditor,
    setPage
} from '../../actions/widgets';
import Message from '../../components/I18N/Message';
import BorderLayout from '../../components/layout/BorderLayout';
import TableWizardComp from '../../components/widgets/builder/wizard/TableWizard';
import ToolbarComp from '../../components/widgets/builder/wizard/table/Toolbar';
import builderConfiguration from '../../components/widgets/enhancers/builderConfiguration';
import InfoPopover from '../../components/widgets/widget/InfoPopover';
import { isGeometryType } from '../../utils/ogc/WFS/base';
import BuilderHeader from './BuilderHeader';
import LayerSelectorComp from './LayerSelector';
import { wizardSelector, wizardStateToProps } from './commons';
import chartLayerSelector from './enhancers/chartLayerSelector';
import viewportBuilderConnect from './enhancers/connection/viewportBuilderConnect';
import viewportBuilderConnectMask from './enhancers/connection/viewportBuilderConnectMask';
import withConnectButton from './enhancers/connection/withConnectButton';
import withExitButton from './enhancers/withExitButton';

const Builder = connect(
    wizardSelector,
    {
        setPage,
        setValid: valid => changeEditorSetting("valid", valid),
        onEditorChange,
        insertWidget
    },
    wizardStateToProps
)(compose(
    builderConfiguration,
    renameProps({
        editorData: "data",
        onEditorChange: "onChange"
    }),
    mapPropsStream(props$ => props$.merge(
        props$
            .distinctUntilChanged(({ featureTypeProperties: oldFT } = {}, { featureTypeProperties: newFT } = {}) => oldFT === newFT)
            // set propTypes to all attributes when
            .do(({ featureTypeProperties = [], onChange = () => { }, data = {} } = {}) => {
                // initialize attribute list if empty (first time)
                if (onChange && featureTypeProperties.length > 0 && !get(data, "options.propertyName")) {
                    onChange("options.propertyName", featureTypeProperties.filter(a => !isGeometryType(a)).map(ft => ft.name));
                }
            }).ignoreElements()
    ))
)(TableWizardComp));

const Toolbar = compose(
    connect(wizardSelector, {
        openFilterEditor,
        setPage,
        onChange: onEditorChange,
        insertWidget
    },
    wizardStateToProps
    ),
    viewportBuilderConnect,
    withExitButton(),
    withConnectButton(({ step }) => step === 0)
)(ToolbarComp);

/*
 * in case you don't have a layer selected (e.g. dashboard) the table builder
 * prompts a catalog view to allow layer selection
 */
const chooseLayerEnhancer = compose(
    connect(wizardSelector),
    viewportBuilderConnectMask,
    branch(
        ({ layer } = {}) => !layer,
        renderComponent(chartLayerSelector(LayerSelectorComp))
    )
);

export default chooseLayerEnhancer(({ enabled, onClose = () => { }, editorData = {}, exitButton, toggleConnection, availableDependencies = [], dependencies, ...props } = {}) =>

    (<BorderLayout
        header={
            <BuilderHeader onClose={onClose}>
                <Toolbar
                    editorData={editorData}
                    exitButton={exitButton}
                    toggleConnection={toggleConnection}
                    availableDependencies={availableDependencies}
                    onClose={onClose} />
                {get(editorData, "options.propertyName.length") === 0 ? <InfoPopover
                    trigger={false}
                    glyph="exclamation-mark"
                    bsStyle="warning"
                    text={<Message msgId="widgets.builder.errors.checkAtLeastOneAttribute" />} /> : null}
            </BuilderHeader>}
    >
        {enabled ? <Builder editorData={editorData} dependencies={dependencies} {...props} /> : null}
    </BorderLayout>));
