/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Debug from '../../../components/development/Debug';
import Localized from '../../../components/I18N/Localized';
import { connect } from 'react-redux';
import PrintMap from '../components/PrintMap';
import PrintPreview from '../components/PrintPreview';
import { changeZoomLevel } from '../../../actions/map';
import ScaleBoxComp from '../../../components/mapcontrols/scale/ScaleBox';

const ScaleBox = connect((state) => ({
    currentZoomLvl: state.map && state.map.zoom || state.config && state.config.map && state.config.map.zoom
}), {
    onChange: changeZoomLevel
})(ScaleBoxComp);

class Print extends React.Component {
    static propTypes = {
        messages: PropTypes.object,
        locale: PropTypes.string,
        enabled: PropTypes.bool
    };

    render() {
        return (<Localized messages={this.props.messages} locale={this.props.locale}>
            <div className="fill">
                <PrintMap/>
                {this.props.enabled ? <PrintPreview
                    title="Print Preview" style={{
                        position: "absolute",
                        top: "10px",
                        left: "40px",
                        zIndex: 100}}/> : null}
                <ScaleBox/>
                <Debug/>
            </div>
        </Localized>);
    }
}

export default connect((state) => {
    return {
        enabled: state.map && state.print.capabilities && true || false,
        locale: state.locale && state.locale.current,
        messages: state.locale && state.locale.messages || {}
    };
})(Print);
