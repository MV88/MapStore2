/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import { loadVersion } from '../actions/version';
import apiPlugins from './apiPlugins.js';
import appConfigEmbedded from './appConfigEmbedded';
import main from './main';

main(
    appConfigEmbedded,
    apiPlugins,
    (cfg) => ({
        ...cfg,
        initialActions: [loadVersion]
    })
);
