/**
 * Copyright 2015-2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { findIndex } from 'lodash';
import pointOnSurface from 'turf-point-on-surface';

import HTMLViewer from '../components/data/identify/viewers/HTMLViewer';
import JSONViewer from '../components/data/identify/viewers/JSONViewer';
import TextViewer from '../components/data/identify/viewers/TextViewer';
import iconUrl from '../components/map/openlayers/img/marker-icon.png';
import FeatureInfoUtils from './FeatureInfoUtils';
import vector from './mapinfo/vector';
import wms from './mapinfo/wms';
import wmts from './mapinfo/wmts';

export const INFO_FORMATS = FeatureInfoUtils.INFO_FORMATS;
export const EMPTY_RESOURCE_VALUE = 'NODATA';
export const INFO_FORMATS_BY_MIME_TYPE = FeatureInfoUtils.INFO_FORMATS_BY_MIME_TYPE;
export let services = {
    wms,
    wmts,
    vector
};
/**
 * specifies which info formats are currently supported
 */
//           default format ↴
export const AVAILABLE_FORMAT = ['TEXT', 'PROPERTIES', 'HTML', 'TEMPLATE'];

export let VIEWERS = {};
/**
 * @return a filtered version of INFO_FORMATS object.
 * the returned object contains only keys that AVAILABLE_FORMAT contains.
 */
export const getAvailableInfoFormat = () => {
    return Object.keys(INFO_FORMATS).filter((k) => {
        return AVAILABLE_FORMAT.indexOf(k) !== -1;
    }).reduce((prev, k) => {
        prev[k] = INFO_FORMATS[k];
        return prev;
    }, {});
};
/**
 * @return like getAvailableInfoFormat but return an array filled with the keys
 */
export const getAvailableInfoFormatLabels = () => {
    return Object.keys(getAvailableInfoFormat());
};
/**
 * @return the label of an inputformat given the value
 */
export const getLabelFromValue = (value) => {
    return getAvailableInfoFormatLabels().filter(info => INFO_FORMATS[info] === value)[0] || "TEXT";
};
/**
 * @return like getAvailableInfoFormat but return an array filled with the values
 */
export const getAvailableInfoFormatValues = () => {
    return Object.keys(getAvailableInfoFormat()).map( label => {
        return INFO_FORMATS[label];
    });
};
/**
 * @return {string} the default info format value
 */
export const getDefaultInfoFormatValue = () => {
    return INFO_FORMATS[AVAILABLE_FORMAT[0]];
};
/**
 * @return {string} the info format value from layer, otherwise the info format in settings
 */
export const getDefaultInfoFormatValueFromLayer = (layer, props) =>
    layer.featureInfo
        && layer.featureInfo.format
        && INFO_FORMATS[layer.featureInfo.format]
        || props.format
        || getDefaultInfoFormatValue();
export const getLayerFeatureInfoViewer = (layer) => {
    if (layer.featureInfo
        && layer.featureInfo.viewer) {
        return layer.featureInfo.viewer;
    }
    return {};
};
/**
 * returns feature info options of layer
 * @param layer {object} layer object
 * @return {object} feature info options
 */
export const getLayerFeatureInfo = (layer) => {
    return layer && layer.featureInfo && {...layer.featureInfo} || {};
};
export const clickedPointToGeoJson = (clickedPoint) => {
    if (!clickedPoint) {
        return [];
    }
    if (clickedPoint.type === "Feature") {
        let features = [pointOnSurface(clickedPoint)];
        if (clickedPoint && clickedPoint.geometry && clickedPoint.geometry.type !== "Point") {
            features.push(clickedPoint);
        }
        return features;
    }

    if (clickedPoint.lng === undefined || clickedPoint.lat === undefined) {
        return clickedPoint.features || [];
    }
    return [
        ...(clickedPoint.features || []), // highlight features
        {
            id: "get-feature-info-point",
            type: "Feature",
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(clickedPoint.lng), parseFloat(clickedPoint.lat)]
            },
            style: [{
                iconUrl,
                iconAnchor: [12, 41], // in leaflet there is no anchor in fraction
                iconSize: [25, 41]
            }]

        }
    ];
};
export const getMarkerLayer = (name, clickedMapPoint, styleName, otherParams, markerLabel) => {
    return {
        type: 'vector',
        visibility: true,
        name: name || "GetFeatureInfo",
        styleName: styleName || "marker",
        label: markerLabel,
        features: clickedPointToGeoJson(clickedMapPoint),
        ...otherParams
    };
};
/**
 *
 * @param {object} layer the layer object
 * @param {object} options the options for the request
 * @param {string} options.format the format to use
 * @param {string} options.map the map object, with projection and
 * @param {object} options.point
 */
export const buildIdentifyRequest = (layer, options) => {
    if (services[layer.type]) {
        let infoFormat = getDefaultInfoFormatValueFromLayer(layer, options);
        let viewer = getLayerFeatureInfoViewer(layer);
        const featureInfo = getLayerFeatureInfo(layer);
        return services[layer.type].buildRequest(layer, options, infoFormat, viewer, featureInfo);
    }
    return {};
};
export const getValidator = (format) => {
    const defaultValidator = {
        getValidResponses: (responses) => responses,
        getNoValidResponses: () => []
    };
    return {
        getValidResponses: (responses) => {
            return responses.reduce((previous, current) => {
                let infoFormat;
                if (current.queryParams && current.queryParams.hasOwnProperty('info_format')) {
                    infoFormat = current.queryParams.info_format;
                }
                const valid = (FeatureInfoUtils.Validator[current.format || INFO_FORMATS_BY_MIME_TYPE[infoFormat] || INFO_FORMATS_BY_MIME_TYPE[format]] || defaultValidator).getValidResponses([current]);
                return [...previous, ...valid];
            }, []);
        },
        getNoValidResponses: (responses) => {
            return responses.reduce((previous, current) => {
                let infoFormat;
                if (current.queryParams && current.queryParams.hasOwnProperty('info_format')) {
                    infoFormat = current.queryParams.info_format;
                }
                const valid = (FeatureInfoUtils.Validator[current.format || INFO_FORMATS_BY_MIME_TYPE[infoFormat] || INFO_FORMATS_BY_MIME_TYPE[format]] || defaultValidator).getNoValidResponses([current]);
                return [...previous, ...valid];
            }, []);
        }
    };
};
export const getViewers = () => {
    return {
        [FeatureInfoUtils.INFO_FORMATS.PROPERTIES]: JSONViewer,
        [FeatureInfoUtils.INFO_FORMATS.JSON]: JSONViewer,
        [FeatureInfoUtils.INFO_FORMATS.HTML]: HTMLViewer,
        [FeatureInfoUtils.INFO_FORMATS.TEXT]: TextViewer
    };
};
export const defaultQueryableFilter = (l) => {
    return l.visibility &&
        services[l.type] &&
        (l.queryable === undefined || l.queryable) &&
        l.group !== "background"
    ;
};

/**
 * To get the custom viewer with the given type
 * This way you can extend the featureinfo with your custom viewers in external projects.
 * @param type {string} the string the component was registered with
 * @return {object} the registered component
 */
export const getViewer = (type) => {
    return !!VIEWERS[type] ? VIEWERS[type] : null;
};
/**
 * To register a custom viewer
 * This way you can extend the featureinfo with your custom viewers in external projects.
 * @param type {string} the string you want to register the component with
 * @param viewer {object} the component to register
 */
export const setViewer = (type, viewer) => {
    VIEWERS[type] = viewer;
};
/**
 * returns new options filtered by include and exclude options
 * @param layer {object} layer object
 * @param includeOptions {array} options to include
 * @param excludeParams {array} options to exclude
 * @return {object} new filtered options
 */
export const filterRequestParams = (layer, includeOptions, excludeParams) => {
    let includeOpt = includeOptions || [];
    let excludeList = excludeParams || [];
    let options = Object.keys(layer).reduce((op, next) => {
        if (next !== "params" && includeOpt.indexOf(next) !== -1) {
            op[next] = layer[next];
        } else if (next === "params" && excludeList.length > 0) {
            let params = layer[next];
            Object.keys(params).forEach((n) => {
                if (findIndex(excludeList, (el) => {return el === n; }) === -1) {
                    op[n] = params[n];
                }
            }, {});
        }
        return op;
    }, {});
    return options;
};


const MapInfoUtils = {
    AVAILABLE_FORMAT,
    EMPTY_RESOURCE_VALUE,
    VIEWERS,
    getAvailableInfoFormat,
    getLabelFromValue,
    getAvailableInfoFormatLabels,
    getAvailableInfoFormatValues,
    getDefaultInfoFormatValue,
    getDefaultInfoFormatValueFromLayer,
    getLayerFeatureInfoViewer,
    getLayerFeatureInfo,
    clickedPointToGeoJson,
    getMarkerLayer,
    buildIdentifyRequest,
    getValidator,
    getViewers,
    defaultQueryableFilter,
    services,
    getViewer,
    setViewer,
    filterRequestParams
};
export default MapInfoUtils;
