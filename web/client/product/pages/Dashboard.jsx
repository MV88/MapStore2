/**
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, isNil } from 'lodash';
import url from 'url';
const urlQuery = url.parse(window.location.href, true).query;

import { loadDashboard, resetDashboard } from '../../actions/dashboard';
import Page from '../../containers/Page';
import BorderLayout from '../../components/layout/BorderLayout';

class DashboardPage extends React.Component {
    static propTypes = {
        mode: PropTypes.string,
        match: PropTypes.object,
        loadResource: PropTypes.func,
        reset: PropTypes.func,
        plugins: PropTypes.object
    };

    static defaultProps = {
        name: "dashboard",
        mode: 'desktop',
        reset: () => {}
    };

    UNSAFE_componentWillMount() {
        const id = get(this.props, "match.params.did");
        if (id) {
            this.props.reset();
            this.props.loadResource(id);
        } else {
            this.props.reset();
        }
    }
    componentDidUpdate(oldProps) {
        const id = get(this.props, "match.params.did");
        if (get(oldProps, "match.params.did") !== get(this.props, "match.params.did")) {
            if (isNil(id)) {
                this.props.reset();
            } else {
                this.props.loadResource(id);
            }
        }
    }
    componentWillUnmount() {
        this.props.reset();
    }
    render() {
        return (<Page
            id="dashboard"
            component={BorderLayout}
            includeCommon={false}
            plugins={this.props.plugins}
            params={this.props.match.params}
        />);
    }
}

export default connect((state) => ({
    mode: urlQuery.mobile || state.browser && state.browser.mobile ? 'mobile' : 'desktop'
}),
{
    loadResource: loadDashboard,
    reset: resetDashboard
})(DashboardPage);
