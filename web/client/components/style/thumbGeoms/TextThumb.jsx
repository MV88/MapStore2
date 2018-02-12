/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const React = require('react');
const PropTypes = require('prop-types');

class LineThumb extends React.Component {

    static propTypes = {
        count: PropTypes.number,
        linecap: PropTypes.string,
        linejoin: PropTypes.string,
        stroke: PropTypes.string,
        strokeOuter: PropTypes.string,
        style: PropTypes.string,
        styleText: PropTypes.object
    };

    static defaultProps = {
        count: 20,
        linecap: 'round', // butt round square
        linejoin: 'round', // miter round bevel
        stroke: '#ffcc33',
        strokeOuter: '#fff',
        style: 'solid'
    };

    render() {
        return (
            <div className="ms-thumb-geom">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 100 100"}>
                <path
                    d={"M25 75 L50 50 L75 75 L100 75"}
                    strokeLinecap={this.props.linecap}
                    strokeLinejoin={this.props.linejoin}
                    stroke={this.props.styleText.color || this.props.stroke}
                    strokeWidth={this.props.styleText.weight || 10}
                    fill={this.props.styleText.fillColor}/>
            </svg>
        </div>
        );
    }
}

module.exports = LineThumb;
