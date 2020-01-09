/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const { compose, withPropsOnChange } = require('recompose');
const { find, reduce, isEmpty} = require('lodash');

const CoordinatesUtils = require('../../../utils/CoordinatesUtils');
const FilterUtils = require('../../../utils/FilterUtils');
const filterBuilder = require('../../../utils/ogc/Filter/FilterBuilder');
const fromObject = require('../../../utils/ogc/Filter/fromObject');
const { getDependencyLayerParams } = require('./utils');
const { composeAttributeFilters } = require('../../../utils/FilterUtils');
const { gridUpdateToQueryUpdate } = require('../../../utils/FeatureGridUtils');
const getCqlFilter = (layer, dependencies) => {
    const params = getDependencyLayerParams(layer, dependencies);
    const cqlFilterKey = find(Object.keys(params || {}), (k = "") => k.toLowerCase() === "cql_filter");
    return params && cqlFilterKey && params[cqlFilterKey];
};
const { read } = require('../../../utils/ogc/Filter/CQL/parser');
const getLayerFilter = ({layerFilter} = {}) => layerFilter;

const composeFilterObject = (filterObj, quickFilters, options) => {
    const quickFiltersForVisibleProperties = quickFilters && options &&
        Object.keys(quickFilters)
            .filter(qf => find(options.propertyName, f => f === qf))
            .reduce((p, c) => {
                return {...p, [c]: quickFilters[c]};
            }, {});

    // Building new filterObj in order to and the two filters: old filterObj and quickFilter (from Table Widget)
    const columnsFilters = reduce(quickFiltersForVisibleProperties, (cFilters, value, attribute) => {
        return gridUpdateToQueryUpdate({attribute, ...value}, cFilters);
    }, {});
    if (!isEmpty(filterObj) || !isEmpty(columnsFilters)) {
        const composedFilterFields = composeAttributeFilters([filterObj, columnsFilters]);
        return {...filterObj, ...composedFilterFields};
    }
    return {};
};

/**
 * Merges filter object and dependencies map into an ogc filter
 */
module.exports = compose(
    withPropsOnChange(
        ({mapSync, geomProp, dependencies = {}, layer, quickFilters, options } = {}, nextProps = {}, filter) =>
            mapSync !== nextProps.mapSync
            || dependencies.viewport !== (nextProps.dependencies && nextProps.dependencies.viewport)
            || dependencies.quickFilters !== (nextProps.dependencies && nextProps.dependencies.quickFilters)
            || dependencies.options !== (nextProps.dependencies && nextProps.dependencies.options)
            || geomProp !== nextProps.geomProp
            || filter !== nextProps.filter
            || options !== nextProps.options
            || quickFilters !== nextProps.quickFilters
            || getCqlFilter(layer, dependencies) !== getCqlFilter(nextProps.layer, nextProps.dependencies)
            || getLayerFilter(layer) !== getLayerFilter(nextProps.layer),
        ({ mapSync, geomProp = "the_geom", dependencies = {}, filter: filterObj, layer, quickFilters, options} = {}) => {
            const viewport = dependencies.viewport;
            const fb = filterBuilder({ gmlVersion: "3.1.1" });
            const toFilter = fromObject(fb);
            const {filter, property, and} = fb;
            const {layerFilter} = layer || {};
            let geom = {};
            let cqlFilterRules = {};
            let newFilterObj = composeFilterObject(filterObj, quickFilters, options);

            if (!mapSync /* || !dependencies.viewport*/) {
                return {
                    filter: newFilterObj || layerFilter ? filter(and(
                        ...(layerFilter ? FilterUtils.toOGCFilterParts(layerFilter, "1.1.0", "ogc") : []),
                        ...(newFilterObj ? FilterUtils.toOGCFilterParts(newFilterObj, "1.1.0", "ogc") : [])
                    )) : undefined
                };
            }
            if (dependencies.quickFilters) {
                newFilterObj = {...newFilterObj, ...composeFilterObject(newFilterObj, dependencies.quickFilters, dependencies.options)};
            }
            if (dependencies.filter) {
                newFilterObj = {...newFilterObj, ...composeAttributeFilters([newFilterObj, dependencies.filter])};
            }
            if (dependencies.viewport) {
                const bounds = Object.keys(viewport.bounds).reduce((p, c) => {
                    return {...p, [c]: parseFloat(viewport.bounds[c])};
                }, {});
                geom = CoordinatesUtils.getViewportGeometry(bounds, viewport.crs);
                const cqlFilter = getCqlFilter(layer, dependencies);
                cqlFilterRules = cqlFilter
                    ? [toFilter(read(cqlFilter))]
                    : [];
                return {
                    filter: filter(and(
                        ...cqlFilterRules,
                        ...(layerFilter ? FilterUtils.toOGCFilterParts(layerFilter, "1.1.0", "ogc") : []),
                        ...(newFilterObj ? FilterUtils.toOGCFilterParts(newFilterObj, "1.1.0", "ogc") : []),
                        property(geomProp).intersects(geom)))
                };
            }
            return {
                filter: filter(and(
                    ...(layerFilter ? FilterUtils.toOGCFilterParts(layerFilter, "1.1.0", "ogc") : []),
                    ...(newFilterObj ? FilterUtils.toOGCFilterParts(newFilterObj, "1.1.0", "ogc") : [])))
            };
        }
    )

);
