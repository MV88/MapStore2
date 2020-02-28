/*
* Copyright 2017, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

export const currentLocaleSelector = (state) => state.locale && state.locale.current || 'en-US';
export const currentMessagesSelector = (state) => state.locale && state.locale.messages || {};
