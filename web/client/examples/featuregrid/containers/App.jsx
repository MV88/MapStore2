/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { connect } from 'react-redux';
import Debug from '../../../components/development/Debug';
import Localized from '../../../components/I18N/Localized';
import MapViewerComp from '../pages/MapViewer';

const App = (props) => {
    const MapViewer = connect(() => ({
        plugins: props.plugins
    }))(MapViewerComp);
    return (
        <div className="fill">
            <Localized messages={props.messages} locale={props.current} loadingError={props.localeError}>
                <MapViewer params={{mapType: "leaflet", mapId: "0"}} />
            </Localized>
            <Debug/>
        </div>
    );
};

export default connect((state) => {
    return state.locale && {...state.locale} || {};
})(App);
