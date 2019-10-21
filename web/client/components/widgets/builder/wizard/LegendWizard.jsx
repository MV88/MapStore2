/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { compose } from 'recompose';
import emptyState from '../../../misc/enhancers/emptyState';
import { wizardHandlers } from '../../../misc/wizard/enhancers';
import { Row, Col } from 'react-bootstrap';
import legendWidget from '../../enhancers/legendWidget';
import WidgetOptions from './common/WidgetOptions';
const Wizard = wizardHandlers(require('../../../misc/wizard/WizardContainer'));
import StepHeader from '../../../misc/wizard/StepHeader';
import Message from '../../../I18N/Message';
import emptyLegendState from '../../enhancers/emptyLegendState';

const enhancePreview = compose(
    legendWidget,
    emptyState(
        ({valid}) => !valid,
        {
            title: <Message msgId="widgets.builder.errors.noMapAvailableForLegend" />,
            description: <Message msgId="widgets.builder.errors.noMapAvailableForLegendDescription" />
        }
    ),
    emptyLegendState(false)
);
const LegendPreview = enhancePreview(require('../../widget/LegendView'));
export default ({
    onChange = () => {}, onFinish = () => {}, setPage = () => {},
    step = 0,
    dependencies,
    valid,
    data = {}
} = {}) => (
    <Wizard
        step={step}
        setPage={setPage}
        onFinish={onFinish}
        hideButtons>
        <Row>
            <StepHeader title={<Message msgId={`widgets.builder.wizard.preview`} />} />
            <Col xs={12}>
                <div style={{ marginBottom: "30px" }}>
                    <LegendPreview
                        valid={valid}
                        dependencies={dependencies}
                        dependenciesMap={data.dependenciesMap}
                        key="widget-options"
                        onChange={onChange}
                    />
                </div>
            </Col>
        </Row>
        <WidgetOptions
            key="widget-options"
            onChange={onChange}
        />
    </Wizard>
);
