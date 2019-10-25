/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { transaction as transactionEnhancer } from './transaction';

import { insert as insertEnhancer } from './insert';

import {
    deleteFeature as deleteFeatureEnhancer,
    deleteFeaturesByFilter as deleteFeaturesByFilterEnhancer,
    deleteById as deleteByIdEnhancer
} from './delete';


export const insert = insertEnhancer;
export const deleteFeature = deleteFeatureEnhancer;
export const deleteFeaturesByFilter = deleteFeaturesByFilterEnhancer;
export const deleteById = deleteByIdEnhancer;
export const transaction = transactionEnhancer;

