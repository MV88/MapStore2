const PropTypes = require('prop-types');
/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var ol = require('openlayers');
const {isEqual} = require('lodash');
const {getStyle} = require('./VectorStyle');
const {transformPolygonToCircle} = require('../../../utils/DrawSupportUtils');

class Feature extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        layerStyle: PropTypes.object,
        style: PropTypes.object,
        properties: PropTypes.object,
        crs: PropTypes.string,
        container: PropTypes.object, // TODO it must be a ol.layer.vector (maybe pass the source is more correct here?)
        features: PropTypes.array,
        geometry: PropTypes.object, // TODO check for geojson format for geometry
        msId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        featuresCrs: PropTypes.string
    };

    static defaultProps = {
        featuresCrs: "EPSG:4326"
    };

    componentDidMount() {
        this.addFeatures(this.props);
    }

    shouldComponentUpdate(nextProps) {
        return !isEqual(nextProps.properties, this.props.properties) || !isEqual(nextProps.geometry, this.props.geometry) || !isEqual(nextProps.features, this.props.features) || !isEqual(nextProps.style, this.props.style);
    }

    componentWillUpdate(newProps) {
        if (!isEqual(newProps.properties, this.props.properties) || !isEqual(newProps.geometry, this.props.geometry) || !isEqual(newProps.features, this.props.features) || !isEqual(newProps.style, this.props.style)) {
            this.removeFromContainer();
            this.addFeatures(newProps);
        }
    }

    componentWillUnmount() {
        this.removeFromContainer();
    }

    render() {
        return null;
    }

    addFeatures = (props) => {
        const format = new ol.format.GeoJSON();
        let geometry = null;
        if (this.props.type === "FeatureCollection") {
            geometry = this.props.features;
        } else {
            if (this.props.geometry) {
                if (this.props.geometry.type === "GeometryCollection") {
                    geometry = this.props.geometry.geometries;
                } else {
                    geometry = this.props.geometry.coordinates;
                }
            }
        }

        if (props.container && geometry) {
            if (props.features) {
                this._feature = format.readFeatures({
                    type: props.type,
                    properties: props.properties,
                    features: props.features,
                    id: this.props.msId
                });
            } else {
                this._feature = format.readFeatures({
                    type: props.type,
                    properties: props.properties,
                    geometry: props.geometry,
                    id: this.props.msId});
            }
            this._feature.
                map(f => {
                    let newF = f;
                    if (f.getProperties().isCircle) {
                        newF = transformPolygonToCircle(f, props.crs || 'EPSG:3857');
                        newF.setGeometry(newF.getGeometry().transform(props.crs || 'EPSG:3857', props.featuresCrs));
                    }
                    return newF;
                })
                .forEach((f) => f.getGeometry().transform(props.featuresCrs, props.crs || 'EPSG:3857'));
            /*if (props.properties && props.properties.textValues && props.properties.textGeometriesIndexes) {
                this._feature.forEach((f) => {
                    f.set("textValues", props.properties.textValues);
                    f.set("textGeometriesIndexes", props.properties.textGeometriesIndexes);
                });
            }*/
            if (props.style && (props.style !== props.layerStyle)) {
                this._feature.forEach((f) => { f.setStyle(getStyle({style: {...props.style, type: f.getGeometry().getType()}, properties: f.getProperties()})); });
            }
            props.container.getSource().addFeatures(this._feature);
        }
    };


    removeFromContainer = () => {
        if (this._feature) {
            if (Array.isArray(this._feature)) {
                const layersSource = this.props.container.getSource();
                this._feature.map((feature) => {
                    let featureId = feature.getId();
                    if (featureId === undefined) {
                        layersSource.removeFeature(feature);
                    } else {
                        layersSource.removeFeature(layersSource.getFeatureById(featureId));
                    }
                });
            } else {
                this.props.container.getSource().removeFeature(this._feature);
            }
        }
    };
}

module.exports = Feature;
