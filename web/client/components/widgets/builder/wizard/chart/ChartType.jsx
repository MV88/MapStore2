/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Row } from 'react-bootstrap';
import { shouldUpdate } from 'recompose';

import Message from '../../../../I18N/Message';
import SimpleChartComp from '../../../../charts/SimpleChart';
import SideGrid from '../../../../misc/cardgrids/SideGrid';
import StepHeader from '../../../../misc/wizard/StepHeader';
import sampleData from '../../../enhancers/sampleChartData';

const SimpleChart = sampleData(SimpleChartComp);
const sampleProps = {
    legend: false,
    tooltip: false,
    cartesian: false,
    width: 100,
    height: 100,
    popup: false
};

const ITEMS = [{
    type: "bar"
}, {
    type: "pie"
}, {
    type: "line"
}].map( ({type}) => ({
    type,
    title: <Message msgId={`widgets.chartType.${type}.title`} />,
    description: <Message msgId={`widgets.chartType.${type}.description`} />,
    caption: <Message msgId={`widgets.chartType.${type}.caption`} />
}));
export default shouldUpdate(
    ({ types, type }, { types: nextTypes, type: nextType}) => type !== nextType && types !== nextTypes
)(({ onSelect = () => { }, onNextPage = () => { }, types = ITEMS, type} = {}) => (<Row>
    <StepHeader key="title" title={<Message msgId="widgets.selectChartType.title" />} />
    <SideGrid
        key="content"
        onItemClick={item => {onSelect(item.type); onNextPage(); }}
        items={types &&
            ITEMS.map( item =>
                ({
                    ...item,
                    selected: item.type === type,
                    preview: (<SimpleChart
                        {...sampleProps}
                        type={item.type}
                        autoColorOptions={item.type === type ? {
                            base: 0,
                            s: 0,
                            v: 0
                        } : undefined}
                    />)
                }))} />
</Row>
));
