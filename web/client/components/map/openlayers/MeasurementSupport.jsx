/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const React = require('react');
const PropTypes = require('prop-types');
const assign = require('object-assign');
const ol = require('openlayers');
const wgs84Sphere = new ol.Sphere(6378137);
const {reprojectGeoJson, reproject, calculateAzimuth, calculateVincentyDistance, calculateGeodesicDistance} = require('../../../utils/CoordinatesUtils');

const greatCircle = require('@turf/great-circle').default;
const toPoint = require('turf-point');
class MeasurementSupport extends React.Component {
    static propTypes = {
        map: PropTypes.object,
        projection: PropTypes.string,
        measurement: PropTypes.object,
        lengthFormula: PropTypes.string,
        changeMeasurementState: PropTypes.func,
        changeGeometry: PropTypes.func,
        updateOnMouseMove: PropTypes.bool
    };

    static defaultProps = {
        updateOnMouseMove: false
    };

    componentWillReceiveProps(newProps) {
        if (newProps.measurement.geomType && newProps.measurement.geomType !== this.props.measurement.geomType ) {
            this.addDrawInteraction(newProps);
        }
        if (!newProps.measurement.geomType) {
            this.removeDrawInteraction();
        }
    }

    getPointCoordinate = (coordinate) => {
        return reproject(coordinate, this.props.projection, 'EPSG:4326');
    };

    render() {
        return null;
    }

    replaceFeatures = (features) => {
        this.measureLayer.getSource().clear();
        this.source.clear();
        features.forEach((geoJSON) => {
            let geometry = reprojectGeoJson(geoJSON, "EPSG:4326", this.props.map.getView().getProjection().getCode()).geometry;
            const feature = new ol.Feature({
                    geometry: this.createOLGeometry(geometry)
                });
            this.source.addFeature(feature);
        });
    };

    createOLGeometry = ({type, coordinates, radius, center}) => {
        let geometry;
        switch (type) {
            case "Point": { geometry = new ol.geom.Point(coordinates ? coordinates : []); break; }
            case "LineString": { geometry = new ol.geom.LineString(coordinates ? coordinates : []); break; }
            case "MultiPoint": { geometry = new ol.geom.MultiPoint(coordinates ? coordinates : []); break; }
            case "MultiLineString": { geometry = new ol.geom.MultiLineString(coordinates ? coordinates : []); break; }
            case "MultiPolygon": { geometry = new ol.geom.MultiPolygon(coordinates ? coordinates : []); break; }
            // defaults is Polygon
            default: { geometry = radius && center ?
                    ol.geom.Polygon.fromCircle(new ol.geom.Circle([center.x, center.y], radius), 100) : new ol.geom.Polygon(coordinates ? coordinates : []);
            }
        }
        return geometry;
    };

    addDrawInteraction = (newProps) => {
        var vector;
        var draw;
        var geometryType;

        // cleanup old interaction
        if (this.drawInteraction) {
            this.removeDrawInteraction();
        }
        // create a layer to draw on
        this.source = new ol.source.Vector();

        vector = new ol.layer.Vector({
            source: this.source,
            zIndex: 1000000,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });

        this.props.map.addLayer(vector);

        if (newProps.measurement.geomType === 'Bearing') {
            geometryType = 'LineString';
        } else {
            geometryType = newProps.measurement.geomType;
        }

        // create an interaction to draw with
        draw = new ol.interaction.Draw({
            source: this.source,
            type: /** @type {ol.geom.GeometryType} */ geometryType,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });

        this.props.map.on('click', this.updateMeasurementResults, this);
        if (this.props.updateOnMouseMove) {
            this.props.map.on('pointermove', this.updateMeasurementResults, this);
        }

        draw.on('drawstart', function(evt) {
            // preserve the sketch feature of the draw controller
            // to update length/area on drawing a new vertex
            this.sketchFeature = evt.feature;
            // clear previous measurements
            this.source.clear();
        }, this);
        draw.on('drawend', function(evt) {
            const geojsonFormat = new ol.format.GeoJSON();
            let newFeature = reprojectGeoJson(geojsonFormat.writeFeatureObject(evt.feature.clone()), this.props.map.getView().getProjection().getCode(), "EPSG:4326");
            this.props.changeGeometry(newFeature);
            if (this.props.measurement.lineMeasureEnabled) {
                // Calculate arc
                const {coordinates} = newFeature.geometry;
                const start = toPoint(coordinates[0]);
                const end = toPoint(coordinates[1]);
                const grCircle = greatCircle(start, end, {});
                const ft = assign({}, newFeature, {
                    geometry: assign({}, newFeature.geometry,
                        {coordinates: grCircle.geometry.coordinates})
                    });
                this.replaceFeatures([ft]);
            }
        }, this);

        this.props.map.addInteraction(draw);
        this.drawInteraction = draw;
        this.measureLayer = vector;
    };

    removeDrawInteraction = () => {
        if (this.drawInteraction !== null) {
            this.props.map.removeInteraction(this.drawInteraction);
            this.drawInteraction = null;
            this.props.map.removeLayer(this.measureLayer);
            this.sketchFeature = null;
            this.props.map.un('click', this.updateMeasurementResults, this);
            if (this.props.updateOnMouseMove) {
                this.props.map.un('pointermove', this.updateMeasurementResults, this);
            }
        }
    };

    updateMeasurementResults = () => {
        if (!this.sketchFeature) {
            return;
        }
        let bearing = 0;
        let len = 0;
        let sketchCoords = this.sketchFeature.getGeometry().getCoordinates();

        if (this.props.measurement.geomType === 'Bearing' && sketchCoords.length > 1) {
            // calculate the azimuth as base for bearing information
            bearing = calculateAzimuth(sketchCoords[0], sketchCoords[1], this.props.projection);
            if (sketchCoords.length > 2) {
                this.drawInteraction.sketchCoords_ = [sketchCoords[0], sketchCoords[1], sketchCoords[0]];
                this.drawInteraction.finishDrawing();
            }
        }
        const geojsonFormat = new ol.format.GeoJSON();
        let feature = reprojectGeoJson(geojsonFormat.writeFeatureObject(this.sketchFeature.clone()), this.props.map.getView().getProjection().getCode(), "EPSG:4326");
        if (sketchCoords.length >= 2 && this.props.measurement.geomType === 'LineString') {
            if (this.props.lengthFormula === "Haversine") {
                len = calculateGeodesicDistance(this.reprojectedCoordinates(sketchCoords));
            } else if (this.props.lengthFormula === "Vincenty") {
                len = calculateVincentyDistance(this.reprojectedCoordinates(sketchCoords));
            }
        }
        let newMeasureState = assign({}, this.props.measurement,
            {
                point: this.props.measurement.geomType === 'Point' ?
                    this.getPointCoordinate(sketchCoords) : null,
                len,
                area: this.props.measurement.geomType === 'Polygon' ?
                    this.calculateGeodesicArea(this.sketchFeature.getGeometry().getLinearRing(0).getCoordinates()) : 0,
                bearing: this.props.measurement.geomType === 'Bearing' ? bearing : 0,
                lenUnit: this.props.measurement.lenUnit,
                areaUnit: this.props.measurement.areaUnit,
                feature
            }
        );
        this.props.changeMeasurementState(newMeasureState);
    };

    reprojectedCoordinates = (coordinates) => {
        return coordinates.map((coordinate) => {
            let reprojectedCoordinate = reproject(coordinate, this.props.projection, 'EPSG:4326');
            return [reprojectedCoordinate.x, reprojectedCoordinate.y];
        });
    };

    calculateGeodesicArea = (coordinates) => {
        let reprojectedCoordinates = this.reprojectedCoordinates(coordinates);
        return Math.abs(wgs84Sphere.geodesicArea(reprojectedCoordinates));
    };
}

module.exports = MeasurementSupport;
