/**
* Copyright 2018, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';

import { Row, Col } from 'react-bootstrap';
import PagedCombo from '../../../../misc/combobox/PagedCombobox';
import autoComplete from '../../enhancers/autoComplete';
import { compose, defaultProps, withHandlers } from 'recompose';
import localizedProps from '../../../../misc/enhancers/localizedProps';
import { getUsers } from '../../../../../observables/rulesmanager';
import { connect } from 'react-redux';
import { error } from '../../../../../actions/notifications';
import Message from '../../../../I18N/Message';

const UserSelector = (props) => (
    <Row className={props.disabled ? 'ms-disabled' : ''}>
        <Col xs={12} sm={6}>
            <Message msgId="rulesmanager.user"/>
        </Col>
        <Col xs={12} sm={6}>
            <PagedCombo {...props}/>
        </Col>
    </Row>);

export default compose(
    connect(() => ({}), {onError: error}),
    defaultProps({
        size: 5,
        textField: "userName",
        valueField: "userName",
        loadData: getUsers,
        parentsFilter: {},
        filter: false,
        placeholder: "rulesmanager.placeholders.user",
        loadingErrorMsg: {
            title: "rulesmanager.errorTitle",
            message: "rulesmanager.errorLoadingRoles"
        }
    }),
    withHandlers({
        onValueSelected: ({setOption = () => {}}) => filterTerm => {
            setOption({key: "username", value: filterTerm});
        }
    }),
    localizedProps(["placeholder", "loadingErroMsg"]),
    autoComplete
)(UserSelector);
