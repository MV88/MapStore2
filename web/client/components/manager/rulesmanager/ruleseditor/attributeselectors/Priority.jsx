/**
* Copyright 2018, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/
import React from 'react';

import PropTypes from 'prop-types';
import { FormControl, FormGroup, Row, Col } from 'react-bootstrap';
import Message from '../../../../I18N/Message';
import { toNumber, isNumber } from 'lodash';
import withLocalized from '../../../../misc/enhancers/localizedProps';
import { compose, defaultProps } from 'recompose';

class Priority extends React.Component {
    static propTypes = {
        selected: PropTypes.string,
        setOption: PropTypes.func,
        placeholder: PropTypes.string,
        disabled: PropTypes.bool
    }
    static defaultProps = {
        setOption: () => {},
        disabled: false
    }
    getValidationState() {
        if (this.props.selected && this.props.selected.length > 0) {
            return isNumber(toNumber(this.props.selected)) && "success" || "error";
        }
        return null;
    }
    render() {
        const {disabled, selected, placeholder} = this.props;
        return (
            <Row className={disabled ? 'ms-disabled' : ''}>
                <Col xs={12} sm={6}>
                    <Message msgId="rulesmanager.priority"/>
                </Col>
                <Col xs={12} sm={6}>
                    <FormGroup validationState={this.getValidationState()}>
                        <FormControl
                            min="0"
                            type="number"
                            value={selected}
                            placeholder={placeholder}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                </Col>
            </Row>
        );
    }
    handleChange = (e) => {
        this.props.setOption({key: "priority", value: e.target.value});
    }
}

export default compose(
    defaultProps({
        placeholder: "rulesmanager.placeholders.priority"
    }),
    withLocalized(["placeholder"]))(Priority);

