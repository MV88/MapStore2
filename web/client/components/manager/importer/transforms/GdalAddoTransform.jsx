
/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { FormControl, Alert } from 'react-bootstrap';
import assign from 'object-assign';
import { findIndex } from 'lodash';
import { Message } from '../../../I18N/I18N';

class GdalTranslateTransform extends React.Component {
    static propTypes = {
        transform: PropTypes.object,
        editTransform: PropTypes.func
    };

    static defaultProps = {
        transform: {
            options: [],
            levels: []
        },
        editTransform: () => {},
        updateTransform: () => {}
    };

    onChange = (event) => {
        let value = event.target.value || "";
        this.props.editTransform(assign({}, this.props.transform, {[event.target.name]: value.split(/\s+/g) }));
    };

    renderInvalid = () => {
        if (!this.isValid(this.props.transform)) {
            return <Alert bsStyle="danger" key="error">This transform is not valid</Alert>;
        }
        return null;
    };

    render() {
        return (<form>
            <Message msgId="importer.transform.options" /><FormControl name="options" onChange={this.onChange} type="text" value={(this.props.transform.options || []).join(" ")} />
            <Message msgId="importer.transform.overviewlevels" /><FormControl name="levels" onChange={this.onChange} type="text" value={(this.props.transform.levels || []).join(" ")} />
            {this.renderInvalid()}
        </form>);
    }

    isValid = (t) => {
        return t && t.options && findIndex(t.options, (e) => e === "") < 0 &&
            t.levels && findIndex(t.levels, (e) => e === "") < 0;
    };
}

export default GdalTranslateTransform;
