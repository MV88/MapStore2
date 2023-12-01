/*
 * Copyright 2023, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import moment from 'moment';
import { Calendar } from 'react-widgets';
import localizer from 'react-widgets/lib/localizers/moment';
import { Tooltip } from 'react-bootstrap';
import { isDate, isNil } from 'lodash';
import OverlayTrigger from '../OverlayTrigger';
import Hours from './Hours';

localizer(moment);

// lang is supported by moment < 2.8.0 in favour of locale
const localField = typeof moment().locale === 'function' ? 'locale' : 'lang';

function getMoment(culture, value, format) {
    return culture ? moment(value, format)[localField](culture) : moment(value, format);
}

const setTime = (date, dateWithTime) => {
    const value = moment(date);
    value.hours(dateWithTime.getHours())
        .minute(dateWithTime.getMinutes())
        .seconds(dateWithTime.getSeconds())
        .milliseconds(dateWithTime.getMilliseconds());
    return value.toDate();
};

const formats = {
    base: 'lll',
    date: 'L',
    time: 'LT'
};

/**
 * @name DateTimePickerWithRange
 * The revised react-widget datetimepicker to support operator in addition to date and time.
 * This component mimick the react-widget date time picker component behaviours and
 * props. Please see https://jquense.github.io/react-widgets/api/DateTimePicker/.
 * The operator supported must be placed before date in input field and it should be
 * one of !==|!=|<>|<=|>=|===|==|=|<|> operator. Anything else should not be
 * considered as operator by this component.
 *
 */
class DateTimePickerWithRange extends Component {

    static propTypes = {
        format: PropTypes.string,
        type: PropTypes.string,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        calendar: PropTypes.bool,
        popupPosition: PropTypes.oneOf(['top', 'bottom']),
        time: PropTypes.bool,
        value: PropTypes.any,
        operator: PropTypes.string,
        culture: PropTypes.string,
        toolTip: PropTypes.string,
        tabIndex: PropTypes.string,
        options: PropTypes.object
    }

    static defaultProps = {
        placeholder: 'Type date...',
        calendar: true,
        time: true,
        onChange: () => { },
        value: null,
        popupPosition: 'bottom'
    }

    state = {
        openRangeContainer: false,
        openRangeInputs: 'start',			// start, end
        openDateTCalendar: false,
        openTime: false,
        focused: false,
	 	mainInputValue: '',
        inputValue: {			// what's shown on input for user
            startDate: '',
            endDate: ''
        },
        operator: '><',
        date: {				// stored values
            startDate: null,
            endDate: null
        },
        isInputValid: false
    }

    componentDidMount() {
        const { value, operator } = this.props;
        this.setDateFromValueProp(value, operator);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value?.startDate !== this.props.value?.startDate || prevProps.value?.endDate !== this.props.value?.endDate ) {
            const { value, operator } = this.props;
            this.setDateFromValueProp(value, operator);
        }
    }

    getFormat = () => {
        const { format, time, calendar } = this.props;
        const { date: dateFormat, time: timeFormat, base: defaultFormat } = formats;
        return format ? format : !time && calendar ? dateFormat : time && !calendar ? timeFormat : defaultFormat;
    }

    renderInput = (inputValue, operator, toolTip, placeholder, tabIndex, calendarVisible, timeVisible, style) => {
        let inputV = this.props.isWithinAttrTbl ? `${inputValue}` : `${operator}${inputValue}`;
        if (toolTip) {
            return (<OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{toolTip}</Tooltip>}>
                <input style={style} type="text" id="rw_1_input" disabled={'true'} role="combobox" placeholder={placeholder} aria-expanded={calendarVisible || timeVisible} aria-haspopup="true" aria-busy="false" aria-owns="rw_1_cal rw_1_time_listbox" tabIndex={tabIndex} autoComplete="off" value={inputV} className={`rw-input ${this.state.isInputValid ? 'has-error' : ''}`} onChange={this.handleValueChange} />
            </OverlayTrigger>);
        }
        return (<input style={style} type="text" id="rw_1_input" disabled={'true'} role="combobox" placeholder={placeholder} aria-expanded={calendarVisible || timeVisible} aria-haspopup="true" aria-busy="false" aria-owns="rw_1_cal rw_1_time_listbox" tabIndex={tabIndex} autoComplete="off" value={inputV} className={`rw-input ${this.state.isInputValid ? 'has-error' : ''}`} onChange={this.handleValueChange} />);
    }
	renderHoursRange = () =>{
	    const { inputValue, operator, focused, openRangeInputs, openTime } = this.state;
	    const { placeholder, tabIndex } = this.props;
	    const props = Object.keys(this.props).reduce((acc, key) => {
	        if (['placeholder', 'calendar', 'time', 'onChange', 'value', 'toolTip', 'onMouseOver'].includes(key)) {
	            // remove these props because they might have undesired effects to the subsequent components
	            return acc;
	        }
	        acc[key] = this.props[key];
	        return acc;

	    }, {});
	    return (
	        <div onMouseDown={this.handleMouseDown} style={{display: 'flex', flexDirection: 'column', border: 'solid 5px'}}>
	            <div style={{display: 'flex', flexDirection: 'row'}}>
	                <div onClick={this.toggleStart} className="range-tab" style={{width: '50%', fontSize: '8px', height: '40px', color: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: openRangeInputs === 'start' || !openRangeInputs ? 'white' : 'gray', padding: '0.5rem'}}>
	                    <strong style={{fontSize: '12px'}}>Start</strong>
	                    <span>
	                        {inputValue.startDate || 'Please Enter ...' }
	                    </span>
	                </div>
	                <div onClick={this.toggleEnd} className="range-tab" style={{width: '50%', fontSize: '8px', height: '40px', color: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: openRangeInputs === 'end' || !openRangeInputs ? 'white' : 'gray', padding: '0.5rem'}}>
	                    <strong style={{fontSize: '12px'}}>End</strong>
	                    <span>
	                        {inputValue.endDate || 'Please Enter ...' }
	                    </span>
	                </div>
	            </div>
	            <div style={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
	                <div tabIndex="-1" style={{ display: openRangeInputs === 'start' ? 'block' : 'none'}} className={`rw-datetimepicker rw-widget rw-has-neither ${focused ? 'rw-state-focus' : ''}`}>
	                    {this.renderInput(inputValue.startDate, operator, '', placeholder, tabIndex, false, true)}
	                    <span className="rw-select">
	                        <button tabIndex="-1" title="Select Time" type="button" aria-disabled="false" aria-label="Select Time" className="rw-btn-time rw-btn" onClick={this.toggleTime}>
	                            <span aria-hidden="true" className="rw-i rw-i-clock-o"></span>
	                        </button>
	                    </span>
	                    <div style={{display: openTime ? 'block' : 'none'}}>
	                        <Hours ref={this.attachTimeRef} onMouseDown={this.handleMouseDown} {...props} onClose={this.close} onSelect={(evt) => this.handleTimeSelect(evt, 'start')} />
	                    </div>
	                </div>
	                <div tabIndex="-1" style={{ display: openRangeInputs === 'end' ? 'block' : 'none'}} className={`rw-datetimepicker rw-widget rw-has-neither ${focused ? 'rw-state-focus' : ''}`}>
	                    {this.renderInput(inputValue.endDate, operator, '', placeholder, tabIndex, false, true)}
	                    <span className="rw-select">
	                        <button tabIndex="-1" title="Select Time" type="button" aria-disabled="false" aria-label="Select Time" className="rw-btn-time rw-btn" onClick={this.toggleTime}>
	                            <span aria-hidden="true" className="rw-i rw-i-clock-o"></span>
	                        </button>
	                    </span>
	                    <div style={{display: openTime ? 'block' : 'none'}}>
	                        <Hours ref={this.attachTimeRef} onMouseDown={this.handleMouseDown} {...props} onClose={this.close} onSelect={(evt) => this.handleTimeSelect(evt, 'end')} />
	                    </div>
	                </div>
	            </div>
	        </div>
	    );
	}
	renderHours = () =>{
	 	const { inputValue, operator, focused, openRangeContainer } = this.state;
     	const { toolTip, placeholder, tabIndex, popupPosition } = this.props;
     	let shownVal = (inputValue.endDate || inputValue.startDate) ? Object.values(inputValue).join(" : ") : '';
	 	return (
		 	<div tabIndex="-1" onKeyDown={this.handleKeyDown} onBlur={this.handleWidgetBlur} onFocus={this.handleWidgetFocus} className={`rw-datetimepicker range-time-input rw-widget rw-has-neither ${focused ? 'rw-state-focus' : ''}`}>
			 	{this.renderInput(shownVal, operator, toolTip, placeholder, tabIndex, false, true)}
			 	<span className="rw-select">
				 	<button tabIndex="-1" title="Select Time" type="button" aria-disabled="false" aria-label="Select Time" className="rw-btn-time rw-btn" onClick={this.toggleHandler}>
					 	<span aria-hidden="true" className="rw-i rw-i-clock-o"></span>
				 	</button>
			 	</span>
	            { openRangeContainer && <>
	                <div className={`rw-calendar-popup rw-popup-container ${popupPosition === 'top' ? 'rw-dropup' : ''} ${!openRangeContainer ? 'rw-popup-animating' : ''}`} style={{ display: openRangeContainer ? 'block' : 'none', overflow: openRangeContainer ? 'visible' : 'hidden' }}>
	                    {this.renderHoursRange()}
	                </div>
	            </> }

		 	</div>
	 	);
	}
	renderCalendarRange = () =>{
	    const { openRangeInputs, inputValue } = this.state;
	    const props = Object.keys(this.props).reduce((acc, key) => {
	        if (['placeholder', 'calendar', 'time', 'onChange', 'value', 'toolTip', 'onMouseOver'].includes(key)) {
	            // remove these props because they might have undesired effects to the subsequent components
	            return acc;
	        }
	        acc[key] = this.props[key];
	        return acc;

	    }, {});
	    return (
	        <div onMouseDown={this.handleMouseDown} style={{display: 'flex', flexDirection: 'column', border: 'solid 5px'}}>
	            <div style={{display: 'flex', flexDirection: 'row'}}>
	                <div onClick={this.toggleStart} className="range-tab" style={{width: '50%', fontSize: '8px', height: '40px', color: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: openRangeInputs === 'start' || !openRangeInputs ? 'white' : 'gray', padding: '0.5rem'}}>
	                    <strong style={{fontSize: '12px'}}>Start</strong>
	                    <span>
	                        {inputValue.startDate || 'Please Enter ...'}
	                    </span>
	                </div>
	                <div onClick={this.toggleEnd} className="range-tab" style={{width: '50%', fontSize: '8px', height: '40px', color: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: openRangeInputs === 'end' || !openRangeInputs ? 'white' : 'gray', padding: '0.5rem'}}>
	                    <strong style={{fontSize: '12px'}}>End</strong>
	                    <span>
	                        {inputValue.endDate || 'Please Enter ...'}
	                    </span>
	                </div>
	            </div>
	            <div style={{display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
	                <div style={{display: openRangeInputs === 'start' ? 'block' : 'none'}}>
	                    <Calendar
	                        tabIndex="-1"
	                        ref={this.attachCalRef}
	                        onMouseDown={this.handleMouseDown}
	                        onChange={(value) => this.handleCalendarChange(value, 'start')}
	                        {...props}
	                        value={!isNil(this.state.date?.startDate || this.props.value?.startDate) ? new Date(this.state.date?.startDate || this.props.value?.startDate) : undefined}
	                        />
	                </div>
	                <div style={{display: openRangeInputs === 'end' ? 'block' : 'none'}}>
	                    <Calendar
	                        tabIndex="-1"
	                        ref={this.attachCalRef}
	                        onMouseDown={this.handleMouseDown}
	                        onChange={(value) => this.handleCalendarChange(value, 'end')}
	                        {...props}
	                        value={!isNil(this.state.date?.endDate || this.props.value?.endDate) ? new Date(this.state.date?.endDate || this.props.value?.endDate) : undefined}
	                    />
	                </div>
	            </div>
	        </div>
	    );
	}
	renderCalendar = () =>{
	    const { inputValue, operator, focused, openRangeContainer, popupPosition } = this.state;
	    const { toolTip, placeholder, tabIndex } = this.props;
	    let shownVal = (inputValue.endDate || inputValue.startDate) ? Object.values(inputValue).join(" : ") : '';

	    return (
	        <div tabIndex="-1" onKeyDown={this.handleKeyDown} onBlur={this.handleWidgetBlur} onFocus={this.handleWidgetFocus} className={`rw-datetimepicker range-time-input rw-widget rw-has-neither ${focused ? 'rw-state-focus' : ''}`}>
	            {this.renderInput(shownVal, operator, toolTip, placeholder, tabIndex, true, false)}
	            <span className="rw-select">
	                <button tabIndex="-1" title="Select Date" type="button" aria-disabled="false" aria-label="Select Date" className="rw-btn-calendar rw-btn" onClick={this.toggleHandler}>
	                    <span aria-hidden="true" className="rw-i rw-i-calendar"></span>
	                </button>
	            </span>
	            { openRangeContainer && <>
	                <div className={`rw-calendar-popup rw-popup-container ${popupPosition === 'top' ? 'rw-dropup' : ''} ${!openRangeContainer ? 'rw-popup-animating' : ''}`} style={{ display: openRangeContainer ? 'block' : 'none', overflow: openRangeContainer ? 'visible' : 'hidden', height: '285px' }}>
	            		{ this.renderCalendarRange() }
	                </div>
	            </>}
	        </div>
	    );
	}
	renderDateTimeRange = () =>{
	    const { inputValue, operator, openRangeInputs, openTime } = this.state;
	    const { placeholder, tabIndex } = this.props;

	    const props = Object.keys(this.props).reduce((acc, key) => {
	        if (['placeholder', 'calendar', 'time', 'onChange', 'value', 'toolTip', 'onMouseOver'].includes(key)) {
	            // remove these props because they might have undesired effects to the subsequent components
	            return acc;
	        }
	        acc[key] = this.props[key];
	        return acc;

	    }, {});
	    return (
	        <div onMouseDown={this.handleMouseDown} style={{display: 'flex', flexDirection: 'column', border: 'solid 5px', maxHeight: '360px', overflowY: 'auto'}}>
	            <div style={{display: 'flex', flexDirection: 'row'}}>
	                <div onClick={this.toggleStart} className="range-tab" style={{width: '50%', fontSize: '8px', height: '40px', color: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: openRangeInputs === 'start' || !openRangeInputs ? 'white' : 'gray', padding: '0.5rem'}}>
	                    <strong style={{fontSize: '12px'}}>Start</strong>
	                    <span>
	                        {inputValue.startDate || 'Please Enter ...'}
	                    </span>
	                </div>
	                <div onClick={this.toggleEnd} className="range-tab" style={{width: '50%', fontSize: '8px', height: '40px', color: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: openRangeInputs === 'end' || !openRangeInputs ? 'white' : 'gray', padding: '0.5rem'}}>
	                    <strong style={{fontSize: '12px'}}>End</strong>
	                    <span>
	                        {inputValue.endDate || 'Please Enter ...'}
	                    </span>
	                </div>
	            </div>
	            <div style={{display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
	                <div style={{display: openRangeInputs === 'start' ? 'block' : 'none'}}>
	                    <Calendar
	                        tabIndex="-1"
	                        ref={this.attachCalRef}
	                        onMouseDown={this.handleMouseDown}
	                        onChange={(evt) => this.handleCalendarChange(evt, 'start')}
	                        {...props}
	                        value={!isNil(this.state.date?.startDate || this.props.value?.startDate) ? new Date(this.state.date?.startDate || this.props.value?.startDate) : undefined}
	                        />
	                	<div style={{ display: openRangeInputs === 'start' ? 'block' : 'none'}}>
	                        <div style={{display: 'flex'}}>
	                    {this.renderInput(inputValue.startDate, operator, '', placeholder, tabIndex, false, true, {width: '100%'})}
	                            <span className="">
	                                <button tabIndex="-1" title="Select Time" type="button" aria-disabled="false" aria-label="Select Time" className="rw-btn-time rw-btn" onClick={this.toggleTime}>
	                                    <span aria-hidden="true" className="rw-i rw-i-clock-o"></span>
	                                </button>
	                            </span>
	                        </div>
	                    <div style={{display: openTime ? 'block' : 'none'}}>
	                        <Hours ref={this.attachTimeRef} onMouseDown={this.handleMouseDown} {...props} onClose={this.close} onSelect={(evt) => this.handleTimeSelect(evt, 'start')} />
	                    </div>
	                </div>
	                </div>
	                <div style={{display: openRangeInputs === 'end' ? 'block' : 'none'}}>
	                    <Calendar
	                        tabIndex="-1"
	                        ref={this.attachCalRef}
	                        onMouseDown={this.handleMouseDown}
	                        onChange={(evt) => this.handleCalendarChange(evt, 'end')}
	                        {...props}
	                        value={!isNil(this.state.date?.endDate || this.props.value?.endDate) ? new Date(this.state.date?.endDate || this.props.value?.endDate) : undefined}
	                    />
	                	<div style={{ display: openRangeInputs === 'end' ? 'block' : 'none'}}>
	                        <div style={{display: 'flex'}}>
	                            {this.renderInput(inputValue.endDate, operator, '', placeholder, tabIndex, false, true, {width: '100%'})}
	                            <span className="">
	                                <button tabIndex="-1" title="Select Time" type="button" aria-disabled="false" aria-label="Select Time" className="rw-btn-time rw-btn" onClick={this.toggleTime}>
	                                    <span aria-hidden="true" className="rw-i rw-i-clock-o"></span>
	                                </button>
	                            </span>
	                        </div>
	                        <div style={{display: openTime ? 'block' : 'none'}}>
	                            <Hours ref={this.attachTimeRef} onMouseDown={this.handleMouseDown} {...props} onClose={this.close} onSelect={(evt) => this.handleTimeSelect(evt, 'end')} />
	                        </div>
	                	</div>
	                </div>
	            </div>
	        </div>
	    );
	}
	renderCalendarTimeDate = () =>{
	    const { openRangeContainer, inputValue, operator, focused } = this.state;
	    const { toolTip, placeholder, tabIndex, popupPosition } = this.props;
	    let shownVal = (inputValue.endDate || inputValue.startDate) ? Object.values(inputValue).join(" : ") : '';

	    return (
	        <div tabIndex="-1" onKeyDown={this.handleKeyDown} onBlur={this.handleWidgetBlur} onFocus={this.handleWidgetFocus} className={`rw-datetimepicker range-time-input rw-widget ${focused ? 'rw-state-focus' : ''}`}>
	            {this.renderInput(shownVal, operator, toolTip, placeholder, tabIndex, true, true)}
	            <span className="rw-select">
	                <button tabIndex="-1" title="Select Date" type="button" aria-disabled="false" aria-label="Select Date" className="rw-btn-calendar rw-btn" onClick={this.toggleHandler}>
	                    <span aria-hidden="true" className="rw-i rw-i-calendar"></span>
	                </button>
	            </span>
	            { openRangeContainer && <>
	                <div className={`rw-calendar-popup rw-popup-container ${popupPosition === 'top' ? 'rw-dropup' : ''} ${!openRangeContainer ? 'rw-popup-animating' : ''}`} style={{ display: openRangeContainer ? 'block' : 'none', overflow: openRangeContainer ? 'visible' : 'hidden' }}>
	                    {this.renderDateTimeRange()}
	                </div>
	            </> }
	        </div>
	    );
	}

	render() {
	    const { type } = this.props;
	    if (type === 'time') return this.renderHours();
	    else if (type === 'date') return this.renderCalendar();
	    return this.renderCalendarTimeDate();
	}

    inputFlush = false;
    // Ignore blur to manual control de-rendering of cal/time popup
    ignoreBlur = false;

    handleWidgetFocus = () => {
        this.setState({ focused: true });
        this.ignoreBlur = false;
    }

    handleWidgetBlur = () => {
        if (this.ignoreBlur) {
            return;
        }
        this.setState({ openRangeContainer: '', focused: false });
    }
	rangeContainerMouseLeaveHandler = () => {
	    this.setState({ openRangeContainer: false });
	}
    handleMouseDown = () => {
        this.ignoreBlur = true;
    }

    toggleStart = () => {
        if (this.state.openRangeInputs !== 'start') {
            this.setState({ openRangeInputs: 'start', openTime: false, openDateTCalendar: false });
        }
    }
	toggleEnd = () => {
	 	if (this.state.openRangeInputs !== 'end') {
		  	this.setState({ openRangeInputs: 'end', openTime: false, openDateTCalendar: false });
	 	}
	}
	toggleTime = () => {
	    this.setState(prev => ({ openTime: !prev.openTime }));
	}
	toggleHandler = () => {
	    this.setState(prevState => ({ openRangeContainer: !prevState.openRangeContainer, openTime: false, openDateTCalendar: false }));
	}

    handleInputBlur = () => {
        if (this.inputFlush) {
            // date has changed
            const parsed = this.parse(this.state.inputValue);
            const dateStr = this.format(parsed);
            this.setState({
                inputValue: dateStr,
                date: parsed
            });
            this.inputFlush = false;
            this.props.onChange(parsed, `${this.state.operator}${dateStr}`);
        }
    }
	handleKeyDown = e => {
	    if (e.key === 'Escape') {
	        // escape key should close the calendar or time popup
	        this.close();
	        return;
	    }
	}
    setDateFromValueProp = (value, operator) => {
        if (isDate(value)) {
            let startValue = this.format(value?.startDate);
            let endValue = this.format(value?.endDate);
            let inputValue = {
                startDate: startValue,
                endDate: endValue
            };
            this.setState(prevState => ({ date: { ...value }, inputValue, operator: operator || prevState.operator }));
        }
    }

    parse = (value) => {
        const { culture } = this.props;
        const format = this.getFormat();
        if (value) {
            const m = getMoment(culture, value, format);
            if (m.isValid()) return m.toDate();
        }
        return null;
    }

    format = (value) => {
        if (!value) return '';
        const { culture } = this.props;
        const format = this.getFormat();
        const m = getMoment(culture, value);
        if (m.isValid()) return m.format(format);
        return '';
    }

    close = () => {
        this.setState({ openRangeContainer: '' });
    }

    openHandler = () => {
        const { calendar, time } = this.props;
        return !calendar && time ? this.setState({ open: 'time' }) : calendar && !time ? this.setState({ open: 'date' }) : '';
    }


    handleValueChange = (event) => {
        const { value } = event.target;
        const match = /\s*(!==|!=|<>|<=|>=|===|==|=|<|>)?(.*)/.exec(value);
        this.setState({ mainInputValue: match[2], operator: match[1] || '' });
        this.inputFlush = true;
    }

    handleCalendarChange = (value, order) => {
        const date = setTime(value, new Date(value));
        const inputValue = this.format(date);
        let inputValueClone = { ...this.state.inputValue};
        if (order === 'start') inputValueClone.startDate = inputValue;
        else inputValueClone.endDate = inputValue;
        let upadtedDate = {
            startDate: order === 'start' ? date : this.state.date.startDate,
            endDate: order === 'end' ? date : this.state.date.endDate
        };
        let startTimeStamp = upadtedDate.startDate ? (upadtedDate.startDate).getTime() : 0;
        let endTimeStamp = upadtedDate.endDate ? (upadtedDate.endDate).getTime() : 0;
        if (upadtedDate.startDate && upadtedDate.endDate && endTimeStamp < startTimeStamp) {
            this.setState({
                date: upadtedDate,
                inputValue: inputValueClone,
                isInputValid: true
            });
            return;
        }
        this.setState({
            date: upadtedDate,
            inputValue: inputValueClone,
            isInputValid: false
        });
        if (order === 'start') this.props.onChange(date, inputValueClone.startDate, 'start');
        else if (order === 'end') this.props.onChange(date, inputValueClone.endDate, 'end');
    }

    handleTimeSelect = (time, order) => {
        const selectedDate = (order === 'start' ? this.state.date.startDate : this.state.date.endDate ) || new Date();
        const date = setTime(selectedDate, time.date);
        const inputValue = this.format(date);
        let inputValueClone = { ...this.state.inputValue};
        if (order === 'start') inputValueClone.startDate = inputValue;
        else inputValueClone.endDate = inputValue;
        let upadtedDate = {
            startDate: order === 'start' ? date : this.state.date.startDate,
            endDate: order === 'end' ? date : this.state.date.endDate
        };
        let startTimeStamp = upadtedDate.startDate ? (upadtedDate.startDate).getTime() : 0;
        let endTimeStamp = upadtedDate.endDate ? (upadtedDate.endDate).getTime() : 0;
        if (upadtedDate.startDate && upadtedDate.endDate && endTimeStamp < startTimeStamp) {
            this.setState({ inputValue: inputValueClone, date: upadtedDate, openTime: '', isInputValid: true});
        } else {
            this.setState({ inputValue: inputValueClone, openTime: '', date: upadtedDate, isInputValid: false});
            if (order === 'start') this.props.onChange(date, inputValueClone.startDate, 'start');
            else if (order === 'end') this.props.onChange(date, inputValueClone.endDate, 'end');
        }
    }

    attachTimeRef = ref => (this.timeRef = ref)

    attachCalRef = ref => (this.calRef = ref)

}
export default DateTimePickerWithRange;

