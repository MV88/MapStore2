/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { get, find } from 'lodash';

/**
 * Utility function to get the original layer from "layers" dependency, then, get the "params" object.
 */
export const getDependencyLayerParams = (layer, dependencies) =>
    layer
        && layer.id
        && get(
            find(dependencies.layers || [], {
                id: layer.id
            }),
            "params",
            {}
        );
