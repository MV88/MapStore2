/**
  * Copyright 2017, GeoSolutions Sas.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree.
  */


import loadingStateFactory from '../../misc/enhancers/loadingState';

const loadingState = loadingStateFactory();
import errorChartState from '../enhancers/errorChartState';
import emptyChartState from '../enhancers/emptyChartState';
const SimpleChart = loadingState(errorChartState(emptyChartState((require('../../charts/SimpleChart')))));
import ContainerDimensions from 'react-container-dimensions';
import React from 'react';
export default (props) => (<div className="mapstore-widget-chart">
    <ContainerDimensions>
        <SimpleChart {...props}/>
    </ContainerDimensions>
</div>);
