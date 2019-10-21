/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { Tooltip, Legend } from 'recharts';
import { sameToneRangeColors } from '../../utils/ColorUtils';
import line from './Line';
import pie from './Pie';
import bar from './Bar';
import gauge from './Gauge';
const charts = {
    line,
    pie,
    bar,
    gauge
};

const AUTOCOLOR_DEFAULTS = {
    base: 190,
    range: 0,
    s: 0.95,
    v: 0.63
};
/**
 * Wraps common charts into a single component.
 * @param {boolean} isAnimationActive
 * @param {String} [type="line"]                         Type of the chart. One of "line", "pie", "bar", "gauge"
 * @param {Object} [tooltip={}]                          false to disable tooltip. TooltipOptions otherwise
 * @param {Object} [legend={}]                           false to disable legend. Legend options otherwise
 * @param {Object} [autoColorOptions] [description]      Options to generate colors for the chart
 * @param {[type]} props                                 [description]
 */
const SimpleChart = ({type = "line", tooltip = {}, legend = {}, autoColorOptions = AUTOCOLOR_DEFAULTS, colorGenerator, ...props} = {}) => {
    const Component = charts[type];

    const defaultColorGenerator = (total, colorOptions = autoColorOptions) => {
        const {base, range, ...opts} = colorOptions;
        return (sameToneRangeColors(base, range, total + 1, opts) || [0]).slice(1);
    };

    const CustomTooltip = ({active, payload} = {}) => {
        if (active) {
            const label = payload[0].name;
            const percent = payload[0].percent;
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${label} : ${payload[0].value}`}
                        <span className="desc">&nbsp;({(percent * 100).toFixed(0)}%)</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (<Component
        margin={{top: 5, right: 30, left: 20, bottom: 5}}
        colorGenerator={colorGenerator || defaultColorGenerator}
        autoColorOptions={autoColorOptions}
        {...props}
        {...{legend, tooltip}}
    >
        {tooltip !== false ? type === "pie" ? <Tooltip content={CustomTooltip}/> : <Tooltip {...tooltip}/> : null}
        {legend !== false ? <Legend {...legend} wrapperStyle={{bottom: 0}} /> : null}
    </Component>
    );
};

export default SimpleChart;
