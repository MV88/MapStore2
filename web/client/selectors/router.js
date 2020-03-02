/**
* Copyright 2019, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import { get } from 'lodash';

export const pathnameSelector = (state) => get(state, "router.location.pathname") || "/";
export const searchSelector = (state) => get(state, "router.location.search") || "";
