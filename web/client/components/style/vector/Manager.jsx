/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const PropTypes = require('prop-types');
const React = require('react');
const {castArray, findIndex} = require('lodash');
const {Grid} = require('react-bootstrap');
const assign = require('object-assign');
const uuidv1 = require('uuid/v1');

const SwitchPanel = require('../../misc/switch/SwitchPanel');
const Stroke = require('./Stroke');
const Fill = require('./Fill');
const {/*isMarkerStyle, isTextStyle, isCircleStyle,*/isStrokeStyle, isFillStyle} = require('../../../utils/VectorStyleUtils');


/***/
class Manager extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        switchPanelOptions: PropTypes.array,
        lineDashOptions: PropTypes.array,
        setStyleParameter: PropTypes.func,
        width: PropTypes.number
    };

    static defaultProps = {
        style: {},
        switchPanelOptions: []
    };

    state = {}

    /**
     * it renders a switch panel styler
     * @prop {object} style
     * @prop {object} switchPanelOptions
    */
    renderPanelStyle = (style = {}, switchPanelOptions = {}) => {
        const stylerProps = {
            style,
            onChange: this.change,
            addOpacityToColor: this.addOpacityToColor,
            width: this.props.width
        };
        const lineDashOptions = this.props.lineDashOptions;

        const stroke = isStrokeStyle(style.LineString || style) ? <Stroke {...stylerProps} lineDashOptions={lineDashOptions}/> : null;
        const fill = isFillStyle(style) && <Fill {...stylerProps}/> || null;
        const separator = <hr/>;

        const sections = [stroke, fill];

        return (<Grid fluid style={{ width: '100%' }} className="ms-style">
            <SwitchPanel {...switchPanelOptions}>
                {
                    /*adding the separator between sections*/
                    sections.reduce((prev, curr) => [prev, separator, curr])
                }
            </SwitchPanel>
        </Grid>);
    }

    render() {
        const styles = castArray(this.props.style.LineString || this.props.style);
        const switchPanelOptions = [{
                expanded: true,
                locked: true,
                title: "Line Style"
            }, {
                expanded: this.state.startPoint,
                locked: false,
                onSwitch: () => this.setState({startPoint: !this.state.startPoint}),
                title: 'Start Point'
            }, {
                expanded: this.state.endPoint,
                locked: false,
                onSwitch: () => this.setState({endPoint: !this.state.endPoint}),
                title: 'End Point'
            }];

        return <span>{styles.map((style, i) => this.renderPanelStyle({...style, id: style.id || uuidv1()}, switchPanelOptions[i]))}</span>;
    }
    change = (id, values) => {
        const styles = castArray(this.props.style);
        const styleChangedIndex = findIndex(styles, { 'id': id});
        const newStyle = {...styles[styleChangedIndex], ...values};
        console.log(newStyle);

        this.props.setStyleParameter(styles[0]);
    }
    addOpacityToColor = (color, opacity) => {
        return assign({}, color, {
            a: opacity
        });
    }
}

module.exports = Manager;
