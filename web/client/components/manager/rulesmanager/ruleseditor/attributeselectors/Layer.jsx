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
import { compose, defaultProps, withHandlers, withPropsOnChange } from 'recompose';
import { error } from '../../../../../actions/notifications';
import localizedProps from '../../../../misc/enhancers/localizedProps';
import { loadLayers } from '../../../../../observables/rulesmanager';
import { connect } from 'react-redux';
import Message from '../../../../I18N/Message';

const LayerSelector = (props) => (
    <Row className={props.disabled ? 'ms-disabled' : ''}>
        <Col xs={12} sm={6}>
            <Message msgId="rulesmanager.layer"/>
        </Col>
        <Col xs={12} sm={6}>
            <PagedCombo {...props}/>
        </Col>
    </Row>);

export default compose(
    connect(() => ({}), {onError: error}),
    defaultProps({
        paginated: true,
        size: 5,
        textField: "name",
        valueField: "name",
        loadData: loadLayers,
        parentsFilter: {},
        filter: false,
        placeholder: "rulesmanager.placeholders.layer",
        loadingErrorMsg: {
            title: "rulesmanager.errorTitle",
            message: "rulesmanager.errorLoadingLayers"
        }
    }),
    withPropsOnChange(["workspace"], ({workspace}) => {
        return {
            parentsFilter: {workspace}
        };
    }),
    withHandlers({
        onValueSelected: ({setOption = () => {}}) => filterTerm => {
            setOption({key: "layer", value: filterTerm});
        }
    }),
    localizedProps(["placeholder"]),
    autoComplete
)(LayerSelector);
