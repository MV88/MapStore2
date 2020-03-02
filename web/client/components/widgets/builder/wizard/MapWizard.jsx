/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import WizardContainer from '../../../misc/wizard/WizardContainer';
import { wizardHandlers } from '../../../misc/wizard/enhancers';
import WidgetOptions from './common/WidgetOptions';
import MapOptions from './map/MapOptions';
import Preview from './map/PreviewMap';

const Wizard = wizardHandlers(WizardContainer);

export default ({
    onChange = () => {}, onFinish = () => {}, setPage = () => {},
    step = 0,
    selectedNodes = [],
    onNodeSelect = () => {},
    editorData = {},
    editNode,
    setEditNode = () => {},
    closeNodeEditor = () => {}
} = {}) => (
    <Wizard
        step={step}
        setPage={setPage}
        onFinish={onFinish}
        hideButtons>
        <MapOptions
            editNode={editNode}
            setEditNode={setEditNode}
            closeNodeEditor={closeNodeEditor}
            onNodeSelect={onNodeSelect}
            selectedNodes={selectedNodes}
            onChange={onChange}
            preview={<Preview
                onChange={onChange}
                layers={editorData.map && editorData.map.layers}
                map={editorData.map}
                options={{ style: { margin: 10, height: 'calc(100% - 20px)' } }} /> }
            map={editorData.map}
        />
        <WidgetOptions
            key="widget-options"
            data={editorData}
            onChange={onChange}
        />
    </Wizard>);
