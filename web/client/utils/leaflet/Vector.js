/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import L from 'leaflet';

import Icons from './Icons';
import assign from 'object-assign';
import { isMarkerStyle, isSymbolStyle } from '../VectorStyleUtils';

const getIcon = (style, geojson) => {
    if (style && style.iconGlyph) {
        const iconLibrary = style.iconLibrary || 'extra';
        if (Icons[iconLibrary]) {
            return Icons[iconLibrary].getIcon(style);
        }
    }
    if (style && style.html && geojson) {
        return Icons.html.getIcon(style, geojson);
    }
    if (style && style.iconUrl || style.symbolUrlCustomized || style.symbolUrl) {
        return Icons.standard.getIcon(style);
    }
    return null;
};

export const coordsToLatLngF = function(coords) {
    return new L.LatLng(coords[1], coords[0], coords[2]);
};

export const coordsToLatLngs = function(coords, levelsDeep, coordsToLatLng) {
    var latlngs = [];
    var len = coords.length;
    for (let i = 0, latlng; i < len; i++) {
        latlng = levelsDeep ?
            coordsToLatLngs(coords[i], levelsDeep - 1, coordsToLatLng) :
            (coordsToLatLng || this.coordsToLatLng)(coords[i]);

        latlngs.push(latlng);
    }

    return latlngs;
};

export const isMarker = (props) => {
    // TODO FIX THIS, for geom coll that contains marker or normal points
    if (props.geometry.type === "GeometryCollection") {
        return false;
    }
    const newStructuredStyle = props.style;
    return newStructuredStyle && (isMarkerStyle(newStructuredStyle) || isSymbolStyle(newStructuredStyle) || (newStructuredStyle.iconUrl || newStructuredStyle.iconGlyph));
};
// Create a new Leaflet layer with custom icon marker or circleMarker


export const pointToLayer = (latlng, geojson, style) => {
    const newStyle = style.Point || style.MultiPoint || style;
    const icon = getIcon(newStyle, geojson);
    if (icon) {
        return L.marker(
            latlng,
            {
                icon,
                opacity: newStyle && newStyle.opacity || 1
            });
    }
    return L.marker(latlng, {
        opacity: newStyle && newStyle.opacity || 1
    });
};
export const getPointLayer = function(pointToLayerFunc, geojson, latlng, options) {
    if (pointToLayerFunc) {
        return pointToLayerFunc(geojson, latlng);
    }
    return pointToLayer(latlng, geojson, {...options.style, highlight: options.highlight});
};
/**
* This method creates a valid geoJSON for layer created from GeometryCollection
* The leaflet toGeoJSON transforms the layer created by geometryToLayer in a
* featureCollection of FeatureCollections in that case because for each L.FeatureGroup it creates a FeatureCollection.
* Thus we need to recreate a GeometryCollection and also multi-geometry instead of FeatureCollections
* @return {object} a valid geoJSON
*/
export const toValidGeoJSON = () => {
    // TODO
};
/**
 * create point or text layer
 */
export const createTextPointMarkerLayer = ({pointToLayer: pointToLayerFunc, geojson, latlng, options, style = {}, highlight = false} = {}) => {
    if (geojson.properties && geojson.properties.isText) {
        // this is a Text Feature
        // TODO: improve management for stroke-width because 5px it was not the same as in ol width:5 for ol.style.Stroke
        let myIcon = L.divIcon({html: `<span style="
            font:${style.font};
            color:${style.fillColor};
            -webkit-text-stroke-width:${1}px;
            -webkit-text-stroke-color:${style.color};">${geojson.properties.valueText}</span>`, className: ''});
        return new L.Marker(latlng, {icon: myIcon});
    }
    return getPointLayer(pointToLayerFunc, geojson, latlng, {...options, style, highlight});
};
/**
* create Circle or polygon layer
*/
export const createPolygonCircleLayer = ({geojson, style = {}, latlngs = [], coordsToLatLng = () => {}} = {}) => {
    if (geojson.properties && geojson.properties.isCircle) {
        let latlng = coordsToLatLng(geojson.properties.center);
        return L.circle(latlng, { ...style, radius: geojson.properties.radius});
    }
    return new L.Polygon(latlngs, style);
};

export const updateHighlightStyle = (style) => {
    let {highlight} = style;
    if (highlight) {
        return assign({}, style, {
            dashArray: highlight ? "10" : null
        });
    }
    return style;
};
export const geometryToLayer = function(geojson, options) {
    var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson;
    var coords = geometry ? geometry.coordinates : null;
    var layers = [];
    var props = {style: options.style && options.style[0] || options.style, ...geojson};
    var pointToLayerFunc = options && !isMarker(props) ? function(feature, latlng) {
        // probably this need a fix
        return L.circleMarker(latlng, props.style && props.style[0] || {
            radius: 5,
            color: "red",
            weight: 1,
            opacity: 1,
            fillOpacity: 0
        });
    } : null;
    var latlng;
    var latlngs;
    var i;
    var len;
    let coordsToLatLng = options && options.coordsToLatLng || coordsToLatLngF;

    if (!coords && !geometry) {
        return null;
    }
    let layer;
    let style = props.style || assign({}, options.style && options.style[geometry.type] || options.style, {highlight: options.style && options.style.highlight});

    switch (geometry.type) {
    case 'Point':
        latlng = coordsToLatLng(coords);
        layer = createTextPointMarkerLayer({pointToLayer: pointToLayerFunc, geojson, latlng, options, style, highlight: style && style.highlight});
        return layer;
    case 'MultiPoint':
        for (i = 0, len = coords.length; i < len; i++) {
            latlng = coordsToLatLng(coords[i]);
            layer = createTextPointMarkerLayer({pointToLayer: pointToLayerFunc, geojson, latlng, options, style, highlight: style && style.highlight});
            layer.msId = geojson.id;
            layers.push(layer);
        }
        return new L.FeatureGroup(layers);

    case 'LineString':
        style = updateHighlightStyle(style);
        latlngs = coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, coordsToLatLng);
        layer = new L.Polyline(latlngs, style);
        layer.msId = geojson.id;
        return layer;
    case 'MultiLineString':
        style = updateHighlightStyle(style);
        latlngs = coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, coordsToLatLng);
        for (i = 0, len = latlngs.length; i < len; i++) {
            layer = new L.Polyline(latlngs[i], style);
            layer.msId = geojson.id;
            if (layer) {
                layers.push(layer);
            }
        }
        return new L.FeatureGroup(layers);
    case 'Polygon':
        style = updateHighlightStyle(style);
        latlngs = coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, coordsToLatLng);
        layer = createPolygonCircleLayer({geojson, style, latlngs, coordsToLatLng});
        layer.msId = geojson.id;
        return layer;
    case 'MultiPolygon':
        style = updateHighlightStyle(style);
        latlngs = coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, coordsToLatLng);
        for (i = 0, len = latlngs.length; i < len; i++) {
            layer = createPolygonCircleLayer({geojson, style, latlngs, coordsToLatLng});
            layer.msId = geojson.id;
            if (layer) {
                layers.push(layer);
            }
        }
        return new L.FeatureGroup(layers);
    case 'GeometryCollection':
        for (i = 0, len = geometry.geometries.length; i < len; i++) {
            layer = geometryToLayer({
                geometry: geometry.geometries[i],
                type: 'Feature',
                properties: geojson.properties
            }, options);

            if (layer) {
                layers.push(layer);
            }
        }
        return new L.FeatureGroup(layers);

    default:
        throw new Error('Invalid GeoJSON object.');
    }
};
