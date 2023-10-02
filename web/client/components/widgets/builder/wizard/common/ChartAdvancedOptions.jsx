/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from 'react';
import { isNil } from 'lodash';
import Select from 'react-select';
import { Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Message from '../../../../I18N/Message';

import Slider from '../../../../misc/Slider';
import InfoPopover from '../../../widget/InfoPopover';
import Format from './Format';
import Formula from './Formula';

import SwitchPanel from '../../../../misc/switch/SwitchPanel';
import SwitchButton from '../../../../misc/switch/SwitchButton';
import localizedProps from '../../../../misc/enhancers/localizedProps';

const AxisTypeSelect = localizedProps('options')(Select);

const AXIS_TYPES = [{
    value: '-',
    label: 'widgets.advanced.axisTypes.auto'
}, {
    value: 'linear',
    label: 'widgets.advanced.axisTypes.linear'
}, {
    value: 'category',
    label: 'widgets.advanced.axisTypes.category'
}, {
    value: 'log',
    label: 'widgets.advanced.axisTypes.log'
}, {
    value: 'date',
    label: 'widgets.advanced.axisTypes.date'
}];

const BAR_CHART_TYPES = [{
    id: 'stacked',
    value: 'stack',
    label: 'widgets.advanced.stackedBarChart'
}, {
    id: 'grouped',
    value: 'group',
    label: 'widgets.advanced.groupedBarChart'
}];

const MAX_X_AXIS_LABELS = 200;

function Header({}) {
    return (<span>
        <span style={{ cursor: "pointer" }}><Message msgId="widgets.advanced.title"/></span>
    </span>);
}

function ChartAdvancedOptions({
    classificationAttribute,
    data,
    onChange = () => {}
}) {
    const [barChartType, setBarChartType] = useState(data.barChartType || 'stack');
    return (<SwitchPanel id="displayCartesian"
        header={<Header data={data}/>}
        collapsible
        expanded={data.panel}
        onSwitch={(val) => { onChange("panel", val); }}
    >
        <FormGroup controlId="AdvancedOptions">
            <Col componentClass={ControlLabel} sm={6}>
                <Message msgId="widgets.advanced.displayCartesian" />
            </Col>
            <Col sm={6}>
                <SwitchButton
                    checked={data.cartesian || data.cartesian === false ? !data.cartesian : false}
                    onChange={(val) => { onChange("cartesian", !val); }}
                />
            </Col>
            { data.type === 'bar' &&
                classificationAttribute && (
                <div className="bar-chart-type">
                    <Col componentClass={ControlLabel} sm={6}>
                        <Message msgId="widgets.advanced.barChartType" />
                    </Col>
                    {BAR_CHART_TYPES.map(chartType => (
                        <Col xs={3} className="radio-btn" key={chartType.value}>
                            <input
                                type="radio"
                                id={chartType.id}
                                value={chartType.value}
                                name="barChartType"
                                checked={barChartType === chartType.value}
                                onChange={ e => {
                                    const { value } = e.target;
                                    setBarChartType(value);
                                    onChange("barChartType", value);
                                }}
                            />
                            <Message msgId={chartType.label}/>
                        </Col>
                    ))}
                </div>
            )}
            {/* Y AXIS */}
            <Col componentClass={"label"} sm={12}>
                <Message msgId="widgets.advanced.yAxis" />
            </Col>
            <Col componentClass={ControlLabel} sm={6}>
                <Message msgId="widgets.advanced.xAxisType" />
            </Col>
            <Col sm={6}>
                <AxisTypeSelect
                    value={data.yAxisOpts && data.yAxisOpts.type || '-'}
                    options={AXIS_TYPES}
                    onChange={(val) => {
                        onChange("yAxisOpts.type", val && val.value);
                    }}
                />
            </Col>
            <Col componentClass={ControlLabel} sm={6}>
                <Message msgId="widgets.advanced.hideLabels" />
            </Col>
            <Col sm={6}>
                <SwitchButton
                    checked={data.yAxis || data.yAxis === false ? !data.yAxis : true}
                    onChange={(val) => { onChange("yAxis", !val); }}
                />
            </Col>
            <Format data={data} onChange={onChange}/>
            <Formula data={data} onChange={onChange}/>
            {/* X AXIS */}
            <Col componentClass={"label"} sm={12}>
                <Message msgId="widgets.advanced.xAxis" />
            </Col>
            <Col componentClass={ControlLabel} sm={6}>
                <Message msgId="widgets.advanced.xAxisType" />
            </Col>
            <Col sm={6}>
                <AxisTypeSelect
                    value={data?.xAxisOpts?.type ?? '-'}
                    options={AXIS_TYPES}
                    onChange={(val) => {
                        onChange("xAxisOpts.type", val && val.value);
                    }}
                />
            </Col>
            <Col componentClass={ControlLabel} sm={6}>
                <Message msgId="widgets.advanced.hideLabels" />
            </Col>
            <Col sm={6}>
                <SwitchButton
                    checked={data?.xAxisOpts?.hide ?? false}
                    onChange={(val) => { onChange("xAxisOpts.hide", val); }}
                />
            </Col>
            <Col componentClass={ControlLabel} sm={6}>
                <Message msgId="widgets.advanced.forceTicks" />
            </Col>
            <Col sm={6}>
                <SwitchButton
                    disabled={data?.xAxisOpts?.hide ?? false}
                    checked={!!data?.xAxisOpts?.nTicks}
                    onChange={(val) => { onChange("xAxisOpts.nTicks", val ? MAX_X_AXIS_LABELS : undefined ); }}
                /><span style={{
                    position: "relative",
                    top: -5,
                    margin: 10
                }}><InfoPopover bsStyle="info" text={<Message msgId="widgets.advanced.maxXAxisLabels" msgParams={{ max: MAX_X_AXIS_LABELS }} />} /></span>
            </Col>
            <Col componentClass={ControlLabel} sm={6}>
                <Message msgId="widgets.advanced.xAxisAngle" />
            </Col>
            <Col sm={6} style={{ display: "flex" }}>
                <SwitchButton
                    disabled={data?.xAxisOpts?.hide ?? false}
                    checked={data.xAxisAngle !== undefined}
                    onChange={(val) => { onChange("xAxisAngle", !val ? undefined : 0); }}
                />
                <div style={{ flexGrow: 1, padding: 5 }}>
                    {data.xAxisAngle !== undefined
                        ? <div
                            className="mapstore-slider with-tooltip"
                            onClick={(e) => { e.stopPropagation(); }}
                        ><Slider
                                disabled={!!data?.xAxisOpts?.hide}
                                key="priority"
                                format={{
                                    // this is needed to remove the 2 decimals that this comp adds by default
                                    to: value => `${parseInt(value, 10)}°`,
                                    from: value => Number(value)
                                }}
                                onSlide={(values) => { onChange("xAxisAngle", parseInt(values[0], 10)); }}
                                range={{ min: -90, max: 90 }}
                                start={[!isNil(data.xAxisAngle) ? data.xAxisAngle : 0]}
                                step={15}
                                tooltips={[true]}
                            /></div>
                        : <div style={{ textAlign: "center" }}>Auto</div>}
                </div>
            </Col>

        </FormGroup>
        <FormGroup controlId="yAxisLabel">
            <Col componentClass={"label"} sm={12}>
                <Message msgId="widgets.advanced.legend" />
            </Col>
            <Col componentClass={ControlLabel} sm={6}>
                <Message msgId="widgets.advanced.yAxisLabel" />
            </Col>
            <Col sm={6}>
                <FormControl value={data.yAxisLabel} type="text" onChange={e => onChange("yAxisLabel", e.target.value)} />
            </Col>
        </FormGroup>
    </SwitchPanel>);
}

ChartAdvancedOptions.propTypes = {
    classificationAttribute: PropTypes.string, // [ ] verify is a string
    data: PropTypes.object,
    onChange: PropTypes.func
};

export default ChartAdvancedOptions;
