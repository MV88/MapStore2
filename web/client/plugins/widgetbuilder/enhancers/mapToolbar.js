/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {compose, branch, withProps} from 'recompose';

import {connect} from 'react-redux';
import {insertWidget, setPage, onEditorChange} from '../../../actions/widgets';
import manageLayers from './manageLayers';
import handleNodeEditing from './handleNodeEditing';
import handleRemoveLayer from './handleMapRemoveLayer';
import {wizardSelector, wizardStateToProps} from '../commons';
import mapBuilderConnect from './connection/mapBuilderConnect';
import withConnectButton from './connection/withConnectButton';
import withExitButton from './withExitButton';

export default compose(
    connect(wizardSelector, {
        setPage,
        onChange: onEditorChange,
        insertWidget
    },
    wizardStateToProps
    ),
    manageLayers,
    handleNodeEditing,
    handleRemoveLayer,
    branch(
        ({editNode}) => !!editNode,
        withProps(({ selectedNodes = [], setEditNode = () => { } }) => ({
            buttons: [{
                visible: selectedNodes.length === 1,
                tooltipId: "close",
                glyph: "1-close",
                onClick: () => setEditNode(false)
            }]
        })),
        withProps(({ selectedNodes = [], onRemoveSelected = () => { }, setEditNode = () => { } }) => ({
            tocButtons: [{
                visible: selectedNodes.length === 1,
                glyph: "wrench",
                tooltipId: "toc.toolLayerSettingsTooltip",
                onClick: () => setEditNode(selectedNodes[0])
            }, {
                onClick: () => onRemoveSelected(),
                visible: selectedNodes.length > 0,
                glyph: "trash",
                tooltipId: "toc.toolTrashLayerTooltip"
            }]
        }))
    ),
    mapBuilderConnect,
    withExitButton(undefined, {
        tooltipId: "widgets.builder.wizard.backToMapSelection"
    }),
    withConnectButton(({step}) => step === 0)

);
