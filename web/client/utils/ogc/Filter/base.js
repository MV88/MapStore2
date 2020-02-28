/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { filter as filterHandler, fidFilter as fidFilterHandler} from './filter';

export const fidFilter = fidFilterHandler;
export const filter = filterHandler;

export default {
    fidFilter,
    filter
};
