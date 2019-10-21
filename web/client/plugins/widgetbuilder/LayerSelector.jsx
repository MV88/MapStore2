/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import BorderLayout from '../../components/layout/BorderLayout';
import { selectedCatalogSelector } from '../../selectors/catalog';
import Toolbar from '../../components/widgets/builder/wizard/common/layerselector/Toolbar';
import BuilderHeader from './BuilderHeader';
import InfoPopover from '../../components/widgets/widget/InfoPopover';
import { Message, HTML } from '../../components/I18N/I18N';
import { compose, branch } from 'recompose';

const Catalog = compose(
    branch(
        ({catalog} = {}) => !catalog,
        connect(createSelector(selectedCatalogSelector, catalog => ({catalog})))
    ),
)(require('./Catalog'));
/**
 * Builder page that allows layer's selection
 * @prop {function} [layerValidationStream]
 */
export default ({ onClose = () => { }, setSelected = () => { }, onLayerChoice = () => { }, stepButtons, selected, error, canProceed, layer, catalog, catalogServices} = {}) =>
    (<BorderLayout
        className="bg-body layer-selector"
        header={<BuilderHeader onClose={onClose}>
            <Toolbar stepButtons={stepButtons} canProceed={canProceed} onProceed={() => onLayerChoice(layer)} />
            {selected && !canProceed && error ? <InfoPopover
                trigger={false}
                glyph="warning-sign"
                bsStyle="warning"
                title={<Message msgId="widgets.builder.errors.noWidgetsAvailableTitle" />}
                text={<HTML msgId="widgets.builder.errors.noWidgetsAvailableDescription"/>} /> : null}
        </BuilderHeader>}
    >
        <Catalog services={catalogServices} selected={selected} catalog={catalog} onRecordSelected={r => setSelected(r)} />
    </BorderLayout>);
