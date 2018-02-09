/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const React = require('react');
const PropTypes = require('prop-types');

class PolygonThumb extends React.Component {

    static propTypes = {
        count: PropTypes.number,
        linecap: PropTypes.string,
        linejoin: PropTypes.string,
        stroke: PropTypes.string,
        fill: PropTypes.string,
        strokeOuter: PropTypes.string,
        style: PropTypes.string,
        styleRect: PropTypes.object
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

                <rect width="50" height="50" x="25" y="25" style={{
                        fill: this.props.styleRect.fillColor,
                        strokeWidth: this.props.styleRect.weight || 3,
                        stroke: this.props.styleRect.color || this.props.stroke,
                        fillOpacity: this.props.styleRect.fillOpacity,
                        opacity: this.props.styleRect.opacity
                    }}
                />

            </svg>
        </div>
        );
    }
}

module.exports = PolygonThumb;
