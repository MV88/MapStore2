/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const React = require('react');
const PropTypes = require('prop-types');

class MultiGeomThumb extends React.Component {

    static propTypes = {
        count: PropTypes.number,
        linecap: PropTypes.string,
        linejoin: PropTypes.string,
        stroke: PropTypes.string,
        strokeOuter: PropTypes.string,
        styleMultiGeom: PropTypes.object,
        style: PropTypes.string
    };

    static defaultProps = {
        count: 20,
        linecap: 'round', // butt round square
        linejoin: 'round', // miter round bevel
        stroke: '#ffcc33',
        strokeOuter: '#fff',
        styleMultiGeom: {},
        style: 'solid'
    };

    render() {

        let styleLine = this.props.styleMultiGeom.MultiLineString || this.props.styleMultiGeom.LineString;
        let stylePolygon = this.props.styleMultiGeom.MultiPolygon || this.props.styleMultiGeom.Polygon;
        return (
            <div className="ms-thumb-geom">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 100 100"}>
                <path
                    d={"M10 15 L10 65"}
                    strokeLinecap={this.props.linecap}
                    strokeLinejoin={this.props.linejoin}
                    stroke={styleLine.color || this.props.stroke}
                    strokeWidth={styleLine.weight || 10}
                    fill={styleLine.fillColor}/>
                <rect width="50" height="50" x="40" y="15" style={{
                        fill: stylePolygon.fillColor,
                        strokeWidth: stylePolygon.weight || 3,
                        stroke: stylePolygon.color || this.props.stroke,
                        fillOpacity: stylePolygon.fillOpacity,
                        opacity: stylePolygon.opacity
                    }}
                />
            </svg>
        </div>
        );
    }
}

module.exports = MultiGeomThumb;
