/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const PropTypes = require('prop-types');
const React = require('react');
const Select = require('react-select');
const { join} = require('lodash');
require('react-widgets/lib/less/react-widgets.less');

/**
 * Component used to manage lineDash property for a stroke style
*/
class LineDash extends React.Component {
    static propTypes = {
        lineDash: PropTypes.array,
        menuPlacement: PropTypes.string,
        clearable: PropTypes.bool,
        value: PropTypes.string,
        optionRenderer: PropTypes.func,
        styleRendererPattern: PropTypes.node,
        valueRenderer: PropTypes.func,
        onChange: PropTypes.func,
        options: PropTypes.array
    };

    static defaultProps = {
        lineDash: [1, 0],
        menuPlacement: "top",
        clearable: false,
        onChange: () => {},
        // these should come from configuration
        options: [{
            value: '1, 0'
        }, {
            value: '10, 50, 20'
        }, {
            value: '30, 20'
        }]
    };

    render() {
        return (
            <Select
                options={this.props.options}
                menuPlacement={this.props.menuPlacement}
                clearable={this.props.clearable}
                optionRenderer={this.props.optionRenderer || this.styleRenderer}
                valueRenderer={this.props.valueRenderer || this.styleRenderer}
                value={join(this.props.lineDash, ', ')}
                onChange={({value}) => {
                    const lineDash = value.split(', ');
                    this.props.onChange(lineDash);
                }}
            />);
    }

    /**
     * function used to render a pattern for the linedash
     * @prop {object} option to render
    */
    styleRenderer = (option) => {
        const pattern = this.props.styleRendererPattern ||
            (<svg style={{ height: 25, width: '100%' }} viewBox="0 0 300 25">
                <path
                    stroke={'#333333'}
                    strokeWidth={4}
                    strokeDasharray={option.value}
                    d="M0 12.5, 300 12.5" />
            </svg>);
        return (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingRight: 25 }}>
            {pattern}
        </div>);
    }
}

module.exports = LineDash;
