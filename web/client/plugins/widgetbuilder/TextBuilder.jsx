/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { onEditorChange, insertWidget, setPage } from '../../actions/widgets';
import { wizardSelector, wizardStateToProps } from './commons';
import BorderLayout from '../../components/layout/BorderLayout';
import withExitButton from './enhancers/withExitButton';
import BuilderHeader from './BuilderHeader';

const Toolbar = compose(
    connect(wizardSelector, {
        setPage,
        insertWidget,
        onResetChange: onEditorChange
    },
    wizardStateToProps,
    ),
    withProps(({ onResetChange = () => { } }) => ({
        exitButton: {
            glyph: 'arrow-left',
            tooltipId: "widgets.builder.wizard.backToWidgetTypeSelection",
            onClick: () => onResetChange('widgetType', undefined)
        }
    })),
    withExitButton(),
)(require('../../components/widgets/builder/wizard/text/Toolbar'));

const Builder = connect(
    wizardSelector,
    {
        onChange: onEditorChange
    },
    wizardStateToProps
)(require('../../components/widgets/builder/wizard/TextWizard'));
export default ({ enabled, onClose = () => {}} = {}) =>
    (<BorderLayout
        header={<BuilderHeader onClose={onClose}><Toolbar /></BuilderHeader>}
    >
        {enabled ? <Builder /> : null}
    </BorderLayout>);
