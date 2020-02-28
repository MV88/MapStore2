/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { get } from 'lodash';

export const groupSelector = (state) => get(state, "controls.metadataexplorer.group");
export const savingSelector = (state) => get(state, "catalog.saving");
export const resultSelector = (state) => get(state, "catalog.result");
export const serviceListOpenSelector = (state) => get(state, "catalog.openCatalogServiceList");
export const newServiceSelector = (state) => get(state, "catalog.newService");
export const servicesSelector = (state) => get(state, "catalog.services");
export const newServiceTypeSelector = (state) => get(state, "catalog.newService.type", "csw");
export const selectedCatalogSelector = (state) => get(state, `catalog.services["${get(state, 'catalog.selectedService')}"]`);
export const selectedServiceTypeSelector = (state) => get(state, `catalog.services["${get(state, 'catalog.selectedService')}"].type`, "csw");
export const searchOptionsSelector = (state) => get(state, "catalog.searchOptions");
export const formatsSelector = (state) => get(state, "catalog.supportedFormats") || [{name: "csw", label: "CSW"}, {name: "wms", label: "WMS"}, {name: "wmts", label: "WMTS"}];
export const loadingErrorSelector = (state) => get(state, "catalog.loadingError");
export const loadingSelector = (state) => get(state, "catalog.loading", false);
export const selectedServiceSelector = (state) => get(state, "catalog.selectedService");
export const modeSelector = (state) => get(state, "catalog.mode", "view");
export const layerErrorSelector = (state) => get(state, "catalog.layerError");
export const searchTextSelector = (state) => get(state, "catalog.searchOptions.text", "");
export const activeSelector = (state) => get(state, "controls.toolbar.active") === "metadataexplorer" || get(state, "controls.metadataexplorer.enabled");
export const authkeyParamNameSelector = (state) => {
    return (get(state, "localConfig.authenticationRules") || []).filter(a => a.method === "authkey").map(r => r.authkeyParamName) || [];
};
export const pageSizeSelector = (state) => get(state, "catalog.pageSize", 4);
export const delayAutoSearchSelector = (state) => get(state, "catalog.delayAutoSearch", 1000);
