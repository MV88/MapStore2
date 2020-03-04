/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const getAttributeName = (k, d) => d.targetPrefix ? d.targetPrefix + ":" + k : k;
import { getValue, getTypeName, getPropertyDescriptor, findGeometryProperty } from '../../WFS/base';

export const attribute = (key, value) => `<${key}>${value}</${key}>`;
export const attributes = (f, describeFeatureType) =>
    Object.keys(f.properties || [])
        .filter(k => getPropertyDescriptor(k, describeFeatureType))
        .map((key) => attribute(getAttributeName(key, describeFeatureType), getValue(f.properties[key], key, describeFeatureType)));
export const geometryAttribute = (f, describeFeatureType) =>
    attribute(getAttributeName(f.geometry_name || findGeometryProperty(describeFeatureType).name, describeFeatureType), getValue(f.geometry, f.geometry_name, describeFeatureType));

export const feature = (f, describeFeatureType) => `<${getTypeName(describeFeatureType)}>`
    + (attributes(f, describeFeatureType)
        .concat(geometryAttribute(f, describeFeatureType))
    ).join("")
    + `</${getTypeName(describeFeatureType)}>`;
export const features = (fs, describeFeatureType) => fs.map(f => feature(f, describeFeatureType)).join("");

export const insert = (fs, describeFeatureType) => '<wfs:Insert>'
    + `${features(fs.features || fs, describeFeatureType)}`
    + '</wfs:Insert>';

export default {
    insert,
    feature
};
