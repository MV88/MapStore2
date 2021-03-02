/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { shouldUpdate } from 'recompose';

export default shouldUpdate((props, nextProps) => nextProps.response !== props.response)(
    props => {
        return (<div className="mapstore-custom-viewer">
            {(props.response?.features || []).map(feature => {
                return <h1>{Object.keys(feature.properties).reduce((text, prop) => `${text} ${feature.properties[prop]}`, "")}</h1>;
            })}
        </div>);
    }
);
