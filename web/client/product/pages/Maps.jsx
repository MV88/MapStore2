/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';

import '../assets/css/maps.css';
import { connect } from 'react-redux';
import url from 'url';
const urlQuery = url.parse(window.location.href, true).query;

import { resetControls } from '../../actions/controls';
import Page from '../../containers/Page';

class MapsPage extends React.Component {
    static propTypes = {
        mode: PropTypes.string,
        match: PropTypes.object,
        reset: PropTypes.func,
        plugins: PropTypes.object
    };

    static defaultProps = {
        mode: 'desktop',
        reset: () => {}
    };

    UNSAFE_componentWillMount() {
        if (this.props.match.params.mapType && this.props.match.params.mapId) {
            if (this.props.mode === 'mobile') {
                require('../assets/css/mobile.css');
            }
            this.props.reset();
        }
    }

    render() {
        return (<Page
            id="maps"
            plugins={this.props.plugins}
            params={this.props.match.params}
        />);
    }
}

export default connect((state) => ({
    mode: urlQuery.mobile || state.browser && state.browser.mobile ? 'mobile' : 'desktop'
}),
{
    reset: resetControls
})(MapsPage);
