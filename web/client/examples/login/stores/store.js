/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DebugUtils from '../../../utils/DebugUtils';

import { combineReducers } from 'redux';
import map from '../../../reducers/map';

import browser from '../../../reducers/browser';
import config from '../../../reducers/config';
import locale from '../../../reducers/locale';
import security from '../../../reducers/security';
import controls from '../../../reducers/controls';

// reducers
const allReducers = combineReducers({
    map: () => {return null; },
    browser,
    config,
    locale,
    security,
    controls
});

const rootReducer = (state, action) => {
    let mapState = map(state.map, action);
    return {
        ...allReducers(state, action),
        map: mapState
    };
};

// export the store with the given reducers
export default DebugUtils.createDebugStore(rootReducer, {
    controls: {
        LoginForm: {
            enabled: true
        }
    }
});
