/**
  * Copyright 2018, GeoSolutions Sas.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree.
  */
import React from 'react';

import { isNil } from 'lodash';
import { compose, lifecycle } from 'recompose';
import { wizardHandlers } from '../../../misc/wizard/enhancers';
import loadingStateFactory from '../../../misc/enhancers/loadingState';
const loadingState = loadingStateFactory(({loading, data}) => loading || !data, {width: 500, height: 200});
import wfsChartOptions from './common/wfsChartOptions';
import noAttributes from './common/noAttributesEmptyView';

const CounterOptions = wfsChartOptions(noAttributes(({options = []}) => options.length === 0)(require('./common/WPSWidgetOptions')));
import WidgetOptions from './common/WidgetOptions';
import wpsCounter from '../../enhancers/wpsCounter';
import dependenciesToFilter from '../../enhancers/dependenciesToFilter';
import dependenciesToOptions from '../../enhancers/dependenciesToOptions';
import dependenciesToWidget from '../../enhancers/dependenciesToWidget';
import emptyChartState from '../../enhancers/emptyChartState';
import errorChartState from '../../enhancers/errorChartState';

const isCounterOptionsValid = (options = {}) => options.aggregateFunction && options.aggregationAttribute;
const triggerSetValid = compose(
    lifecycle({
        UNSAFE_componentWillReceiveProps: ({ valid, data = [], options = {}, setValid = () => { }, error } = {}) => {
            const isNowValid = !isNil(data[0]) && !error;
            if (!!valid !== !!isNowValid && isCounterOptionsValid(options)) {
                setValid(isNowValid);
            }
        }
    }));

const enhancePreview = compose(
    dependenciesToWidget,
    dependenciesToFilter,
    dependenciesToOptions,
    wpsCounter,
    triggerSetValid,
    loadingState,
    errorChartState,
    emptyChartState
);

const sampleProps = {
    style: {
        width: 450,
        height: 100
    }
};

const Wizard = wizardHandlers(require('../../../misc/wizard/WizardContainer'));


import Counter from '../../widget/CounterView';
const Preview = enhancePreview(Counter);
const CounterPreview = ({ data = {}, layer, dependencies = {}, valid, setValid = () => { } }) =>
    !isCounterOptionsValid(data.options)
        ? <Counter
            {...sampleProps}
            data={[{data: 42}]}
            options={data.options}
            series={[{dataKey: "data"}]} />
        : <Preview
            {...sampleProps}
            valid={valid}
            dependenciesMap={data.dependenciesMap}
            dependencies={dependencies}
            setValid={setValid}
            type={data.type}
            legend={data.legend}
            layer={data.layer || layer}
            filter={data.filter}
            geomProp={data.geomProp}
            mapSync={data.mapSync}
            options={data.options} />;

const enhanceWizard = compose(lifecycle({
    UNSAFE_componentWillReceiveProps: ({data = {}, valid, setValid = () => {}} = {}) => {
        if (valid && !isCounterOptionsValid(data.options)) {
            setValid(false);
        }
    }})
);
export default enhanceWizard(({ onChange = () => { }, onFinish = () => { }, setPage = () => { }, setValid = () => { }, valid, formOptions, data = {}, layer = {}, step = 0, types, featureTypeProperties, dependencies}) =>
    (<Wizard
        step={step}
        setPage={setPage}
        onFinish={onFinish}
        isStepValid={n => n === 1 ? isCounterOptionsValid(data.options) : true} hideButtons>
        <CounterOptions
            dependencies={dependencies}
            key="chart-options"
            formOptions={formOptions}
            featureTypeProperties={featureTypeProperties}
            types={types}
            data={data}
            onChange={onChange}
            layer={data.layer || layer}
            sampleChart={<CounterPreview
                data={data}
                valid={valid}
                layer={data.layer || layer}
                dependencies={dependencies}
                setValid={v => setValid(v && isCounterOptionsValid(data.options))} />}
        />
        <WidgetOptions
            key="widget-options"
            data={data}
            onChange={onChange}
            layer={data.layer || layer}
            sampleChart={<CounterPreview
                data={data}
                valid={valid}
                layer={data.layer || layer}
                dependencies={dependencies}
                setValid={v => setValid(v && isCounterOptionsValid(data.options))} />}
        />
    </Wizard>));
