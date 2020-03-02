/**
* Copyright 2018, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/
import React from 'react';

import PagedCombo from '../../../../misc/combobox/PagedCombobox';
import { Row, Col } from 'react-bootstrap';
import fixedOptions from '../../enhancers/fixedOptions';
import localizedProps from '../../../../misc/enhancers/localizedProps';
import { compose, defaultProps, withHandlers, withPropsOnChange } from 'recompose';
import Message from '../../../../I18N/Message';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { servicesSelector } from '../../../../../selectors/rulesmanager';

const selector = createSelector(servicesSelector, ( services) => ({
    services
}));

const WorkspaceSelector = (props) => (
    <Row className={props.disabled ? 'ms-disabled' : ''}>
        <Col xs={12} sm={6}>
            <Message msgId="rulesmanager.service"/>
        </Col>
        <Col xs={12} sm={6}>
            <PagedCombo {...props}/>
        </Col>
    </Row>);

export default compose(
    connect(selector),
    defaultProps({
        size: 5,
        textField: "label",
        valueField: "value",
        parentsFilter: {},
        filter: "startsWith",
        placeholder: "rulesmanager.placeholders.service",
        data: [
            {value: "WMS", label: "WMS"},
            {value: "WFS", label: "WFS"},
            {value: "WCS", label: "WCS"}
        ]
    }),
    withPropsOnChange(["services"], ({services, data}) => ({data: services || data})),
    withHandlers({
        onValueSelected: ({setOption = () => {}}) => filterTerm => {
            setOption({key: "service", value: filterTerm});
        }
    }),
    localizedProps(["placeholder"]),
    fixedOptions
)(WorkspaceSelector);
