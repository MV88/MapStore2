/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

// issue #3147 Element.closest is not supported in ie11
import 'element-closest';
import assign from 'es6-object-assign';
// issue #3153  Embedded doesn't work on ie11
assign.polyfill();
