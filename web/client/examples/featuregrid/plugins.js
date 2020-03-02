/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import FeatureEditor from '../../plugins/FeatureEditor';
import MapPlugin from '../../plugins/Map';
import Notifications from '../../plugins/Notifications';
import QueryPanel from '../../plugins/QueryPanel';
import WFSDownload from '../../plugins/WFSDownload';
import LayerSelectorPlugin from './plugins/LayerSelector';

export const plugins = {
    LayerSelectorPlugin,
    MapPlugin,
    WFSDownload,
    FeatureEditor,
    QueryPanel,
    Notifications
};
export const requires = {};

export default {
    plugins,
    requires
};
