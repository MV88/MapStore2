/*
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import PropTypes from 'prop-types';
import Legend from './legend/Legend';

class WMSLegend extends React.Component {
    static propTypes = {
        node: PropTypes.object,
        legendContainerStyle: PropTypes.object,
        legendStyle: PropTypes.object,
        showOnlyIfVisible: PropTypes.bool,
        currentZoomLvl: PropTypes.number,
        scales: PropTypes.array
    };

    static defaultProps = {
        legendContainerStyle: {},
        showOnlyIfVisible: false
    };

    render() {
        let node = this.props.node || {};
        if (this.canShow(node) && node.type === "wms" && node.group !== "background") {
            return <div style={this.props.legendContainerStyle}><Legend style={this.props.legendStyle} layer={node} currentZoomLvl={this.props.currentZoomLvl} scales={this.props.scales}/></div>;
        }
        return null;
    }

    canShow = (node) => {
        return node.visibility || !this.props.showOnlyIfVisible;
    };
}

export default WMSLegend;
