/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import LayerSelectorPlugin from './plugins/LayerSelector';
import MapPlugin from '../../plugins/Map';
import WFSDownload from '../../plugins/WFSDownload';
import FeatureEditor from '../../plugins/FeatureEditor';
import QueryPanel from '../../plugins/QueryPanel';
import Notifications from '../../plugins/Notifications';

export default {
    plugins: {
        LayerSelectorPlugin,
        MapPlugin,
        WFSDownload,
        FeatureEditor,
        QueryPanel,
        Notifications
    },
    requires: {}
};
