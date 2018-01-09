/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const assign = require('object-assign');
const {head, isArray, isString, castArray, isObject, isEmpty, memoize} = require('lodash');
const urlUtil = require('url');
const CoordinatesUtils = require('./CoordinatesUtils');
const LayersUtils = require('./LayersUtils');
const WMTSUtils = require('./WMTSUtils');
const MapUtils = require('./MapUtils');

const WMS = require('../api/WMS');

const getBaseCatalogUrl = (url) => {
    return url && url.replace(/\/csw$/, "/");
};

const getWMTSBBox = (record, tileMatrixSetName) => {
    let layer = record;
    let bbox = (layer["ows:WGS84BoundingBox"]);
    const tileMatrixSet = head(layer.TileMatrixSet.filter(tM => tM['ows:Identifier'] === tileMatrixSetName));
    bbox = {
        "ows:LowerCorner": "-180 -90",
        "ows:UpperCorner": "180 90"
    };
    // TOPLEFTCORNER IS IN LAT/LON PAIRS but CoordinatesUtils.parseString expect the first one to be the longitude coord
    const origin = layer && tileMatrixSet && tileMatrixSet.TileMatrix && tileMatrixSet.TileMatrix[1] && tileMatrixSet.TileMatrix[1].TopLeftCorner &&
    CoordinatesUtils.parseString(tileMatrixSet.TileMatrix[1].TopLeftCorner.split(" ").reverse().join(" ")) || {};
    if (!!(!isEmpty(origin) && origin.x
    && parseFloat(bbox["ows:LowerCorner"].split(" ")[0]) === -180 && parseFloat(bbox["ows:LowerCorner"].split(" ")[1]) === -90
    && parseFloat(bbox["ows:UpperCorner"].split(" ")[0]) === 180 && parseFloat(bbox["ows:UpperCorner"].split(" ")[1]) === 90
    && layer && tileMatrixSet && tileMatrixSet.TileMatrix[1] && tileMatrixSet.TileMatrix[1].ScaleDenominator
    && tileMatrixSet.TileMatrix[1].MatrixWidth && tileMatrixSet.TileMatrix[1].MatrixHeight
    && tileMatrixSet.TileMatrix[1].TileWidth && tileMatrixSet.TileMatrix[1].TileHeight)) {
        const res = MapUtils.getResolutionsForScales([tileMatrixSet.TileMatrix[1].ScaleDenominator], "EPSG:4326", 96);
        bbox = {
            "ows:LowerCorner": origin.x.toString() + " " + (origin.y - tileMatrixSet.TileMatrix[1].MatrixHeight * tileMatrixSet.TileMatrix[1].TileHeight * res).toString(),
            "ows:UpperCorner": (origin.x + tileMatrixSet.TileMatrix[1].MatrixWidth * tileMatrixSet.TileMatrix[1].TileWidth * res).toString() + " " + (origin.y - 1).toString()
        };
    }
    return bbox;
};

const getNodeText = (node) => {
    return isObject(node) && node._ || node;
};

const filterOnMatrix = (SRS, matrixIds) => {
    return SRS.filter(srs => WMTSUtils.getTileMatrixSet(matrixIds, srs, SRS, matrixIds, null));
};

const converters = {
    csw: (records, options) => {
        let result = records;
        // let searchOptions = catalog.searchOptions;
        if (result && result.records) {
            return result.records.map((record) => {
                let dc = record.dc;
                let thumbURL;
                let wms;
                // look in URI objects for wms and thumbnail
                if (dc && dc.URI) {
                    const URI = isArray(dc.URI) ? dc.URI : (dc.URI && [dc.URI] || []);
                    let thumb = head([].filter.call(URI, (uri) => {return uri.name === "thumbnail"; }) );
                    thumbURL = thumb ? thumb.value : null;
                    wms = head([].filter.call(URI, (uri) => { return uri.protocol === "OGC:WMS-1.1.1-http-get-map"; }));
                }
                // look in references objects
                if (!wms && dc && dc.references && dc.references.length) {
                    let refs = Array.isArray(dc.references) ? dc.references : [dc.references];
                    wms = head([].filter.call( refs, (ref) => { return ref.scheme === "OGC:WMS-1.1.1-http-get-map" || ref.scheme === "OGC:WMS"; }));
                    if (wms) {
                        let urlObj = urlUtil.parse(wms.value, true);
                        let layerName = urlObj.query && urlObj.query.layers;
                        wms = assign({}, wms, {name: layerName} );
                    }
                }
                if (!thumbURL && dc && dc.references) {
                    let refs = Array.isArray(dc.references) ? dc.references : [dc.references];
                    let thumb = head([].filter.call( refs, (ref) => { return ref.scheme === "WWW:LINK-1.0-http--image-thumbnail" || ref.scheme === "thumbnail"; }));
                    if (thumb) {
                        thumbURL = thumb.value;
                    }
                }

                let references = [];

                // extract get capabilities references and add them to the final references
                if (dc && dc.references) {
                    // make sure we have an array of references
                    let rawReferences = Array.isArray(dc.references) ? dc.references : [dc.references];
                    rawReferences.filter((reference) => {
                        // filter all references that correspond to a get capabilities reference
                        return reference.scheme.indexOf("http-get-capabilities") > -1;
                    }).forEach((reference) => {
                        // a get capabilities reference should be absolute and filter by the layer name
                        let referenceUrl = reference.value.indexOf("http") === 0 ? reference.value
                            : options.catalogURL + "/" + reference.value;
                        // add the references to the final list
                        references.push({
                            type: reference.scheme,
                            url: referenceUrl
                        });
                    });
                }

                if (wms && wms.name) {
                    let absolute = (wms.value.indexOf("http") === 0);
                    if (!absolute) {
                        assign({}, wms, {value: options.catalogURL + "/" + wms.value} );
                    }
                    let wmsReference = {
                        type: wms.protocol || wms.scheme,
                        url: wms.value,
                        SRS: [],
                        params: {
                            name: wms.name
                        }
                    };
                    references.push(wmsReference);
                }
                if (thumbURL) {
                    let absolute = (thumbURL.indexOf("http") === 0);
                    if (!absolute) {
                        thumbURL = (getBaseCatalogUrl(options.url) || "") + thumbURL;
                    }
                }
                // create the references array (now only wms is supported)

                // setup the final record object
                return {
                    title: dc && isString(dc.title) && dc.title || '',
                    description: dc && isString(dc.abstract) && dc.abstract || '',
                    identifier: dc && isString(dc.identifier) && dc.identifier || '',
                    thumbnail: thumbURL,
                    tags: dc && isString(dc.subject) && dc.subject || '',
                    boundingBox: record.boundingBox,
                    references: references
                };
            });
        }
    },
    wms: (records, options) => {
        if (records && records.records) {
            return records.records.map((record) => {
                return {
                title: LayersUtils.getLayerTitleTranslations(record) || record.Name,
                description: record.Abstract || record.Title || record.Name,
                identifier: record.Name,
                tags: "",
                capabilities: record,
                service: records.service,
                boundingBox: WMS.getBBox(record),
                dimensions: (record.Dimension && castArray(record.Dimension) || []).map((dim) => assign({}, {
                    values: dim._ && dim._.split(',') || []
                }, dim.$ || {})),
                references: [{
                    type: "OGC:WMS",
                    url: options.url,
                    SRS: (record.SRS && (isArray(record.SRS) ? record.SRS : [record.SRS])) || [],
                    params: {
                        name: record.Name
                    }
                }]
                };
            });
        }
    },
    wmts: (records, options) => {
        if (records && records.records) {
            return records.records.map((record) => {
                const matrixIds = castArray(record.TileMatrixSetLink || []).reduce((previous, current) => {
                    const tileMatrix = head((record.TileMatrixSet || []).filter((matrix) => matrix["ows:Identifier"] === current.TileMatrixSet));
                    const tileMatrixSRS = tileMatrix && CoordinatesUtils.getEPSGCode(tileMatrix["ows:SupportedCRS"]);
                    const levels = current.TileMatrixSetLimits && (current.TileMatrixSetLimits.TileMatrixLimits || []).map((limit) => ({
                        identifier: limit.TileMatrix,
                        ranges: {
                            cols: {
                                min: limit.MinTileCol,
                                max: limit.MaxTileCol
                            },
                            rows: {
                                min: limit.MinTileRow,
                                max: limit.MaxTileRow
                            }
                        }
                    })) || tileMatrix.TileMatrix.map((matrix) => ({
                        identifier: matrix["ows:Identifier"]
                    }));
                    return assign(previous, {
                        [tileMatrix["ows:Identifier"]]: levels,
                        [tileMatrixSRS]: levels
                    });
                }, {});
                const buildSRSMap = memoize((srs) => {
                    return srs.reduce((previous, current) => {
                        return assign(previous, {[current]: true});
                    }, {});
                });
                const allowedSRS = buildSRSMap(record.SRS);
                const tileMatrixSetName = WMTSUtils.getTileMatrixSet(record.TileMatrixSet, "EPSG:4326", allowedSRS, matrixIds);

                const bbox = getWMTSBBox(record, tileMatrixSetName);
                return {
                title: getNodeText(record["ows:Title"] || record["ows:Identifier"]),
                description: getNodeText(record["ows:Abstract"] || record["ows:Title"] || record["ows:Identifier"]),
                identifier: getNodeText(record["ows:Identifier"]),
                tags: "",
                tileMatrixSet: record.TileMatrixSet,
                matrixIds,
                TileMatrixSetLink: castArray(record.TileMatrixSetLink),
                boundingBox: {
                    extent: [
                            bbox["ows:LowerCorner"].split(" ")[0],
                            bbox["ows:LowerCorner"].split(" ")[1],
                            bbox["ows:UpperCorner"].split(" ")[0],
                            bbox["ows:UpperCorner"].split(" ")[1]
                    ],
                    crs: "EPSG:4326"
                },
                references: [{
                    type: "OGC:WMTS",
                    url: record.GetTileUrl || options.url,
                    SRS: filterOnMatrix(record.SRS || [], matrixIds),
                    params: {
                        name: record["ows:Identifier"]
                    }
                }]
                };
            });
        }
    }
};

const CatalogUtils = {

    getCatalogRecords: (format, records, options) => {
        return converters[format] && converters[format](records, options) || null;
    }
};


module.exports = CatalogUtils;
