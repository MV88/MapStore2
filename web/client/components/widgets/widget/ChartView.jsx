/**
  * Copyright 2017, GeoSolutions Sas.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree.
  */

import React from 'react';
import ContainerDimensions from 'react-container-dimensions';

import SimpleChartComp from '../../charts/SimpleChart';
import loadingStateFactory from '../../misc/enhancers/loadingState';
import emptyChartState from '../enhancers/emptyChartState';
import errorChartState from '../enhancers/errorChartState';

const loadingState = loadingStateFactory();
const SimpleChart = loadingState(errorChartState(emptyChartState((SimpleChartComp))));
export default (props) => (<div className="mapstore-widget-chart">
    <ContainerDimensions>
        <SimpleChart {...props}/>
    </ContainerDimensions>
</div>);
