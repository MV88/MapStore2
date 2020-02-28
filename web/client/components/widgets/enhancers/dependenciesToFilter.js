/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { compose, withPropsOnChange } from 'recompose';

import CoordinatesUtils from '../../../utils/CoordinatesUtils';
import FilterUtils from '../../../utils/FilterUtils';
import filterBuilder from '../../../utils/ogc/Filter/FilterBuilder';
import fromObject from '../../../utils/ogc/Filter/fromObject';
import { getDependencyLayerParams } from './utils';
import { find } from 'lodash';
const getCqlFilter = (layer, dependencies) => {
    const params = getDependencyLayerParams(layer, dependencies);
    const cqlFilterKey = find(Object.keys(params || {}), (k = "") => k.toLowerCase() === "cql_filter");
    return params && cqlFilterKey && params[cqlFilterKey];
};
import { read } from '../../../utils/ogc/Filter/CQL/parser';
const getLayerFilter = ({layerFilter} = {}) => layerFilter;

/**
 * Merges filter object and dependencies map into an ogc filter
 */
export default compose(
    withPropsOnChange(
        ({mapSync, geomProp, dependencies = {}, layer} = {}, nextProps = {}, filter) =>
            mapSync !== nextProps.mapSync
            || dependencies.viewport !== (nextProps.dependencies && nextProps.dependencies.viewport)
            || geomProp !== nextProps.geomProp
            || filter !== nextProps.filter
            || getCqlFilter(layer, dependencies) !== getCqlFilter(nextProps.layer, nextProps.dependencies)
            || getLayerFilter(layer) !== getLayerFilter(nextProps.layer),
        ({ mapSync, geomProp = "the_geom", dependencies = {}, filter: filterObj, layer} = {}) => {
            const viewport = dependencies.viewport;
            const fb = filterBuilder({ gmlVersion: "3.1.1" });
            const toFilter = fromObject(fb);
            const {filter, property, and} = fb;
            const {layerFilter} = layer || {};

            if (!mapSync || !dependencies.viewport) {
                return {
                    filter: filterObj || layerFilter ? filter(and(
                        ...(layerFilter ? FilterUtils.toOGCFilterParts(layerFilter, "1.1.0", "ogc") : []),
                        ...(filterObj ? FilterUtils.toOGCFilterParts(filterObj, "1.1.0", "ogc") : [])
                    )) : undefined
                };
            }

            const bounds = Object.keys(viewport.bounds).reduce((p, c) => {
                return {...p, [c]: parseFloat(viewport.bounds[c])};
            }, {});
            const geom = CoordinatesUtils.getViewportGeometry(bounds, viewport.crs);
            const cqlFilter = getCqlFilter(layer, dependencies);
            const cqlFilterRules = cqlFilter
                ? [toFilter(read(cqlFilter))]
                : [];
            return {
                filter: filter(and(
                    ...cqlFilterRules,
                    ...(layerFilter ? FilterUtils.toOGCFilterParts(layerFilter, "1.1.0", "ogc") : []),
                    ...(filterObj ? FilterUtils.toOGCFilterParts(filterObj, "1.1.0", "ogc") : []),
                    property(geomProp).intersects(geom)))
            };
        }
    )

);
