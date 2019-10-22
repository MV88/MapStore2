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
import print from '../../../reducers/print';
import controls from '../../../reducers/controls';

// reducers
const allReducers = combineReducers({
    browser,
    config,
    locale,
    map: () => {return null; },
    print,
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
        print: {
            enabled: true
        }
    },
    print: {
        spec: {
            antiAliasing: true,
            iconSize: 24,
            legendDpi: 96,
            fontFamily: "Verdana",
            fontSize: 8,
            bold: false,
            italic: false,
            resolution: 96,
            name: '',
            description: ''
        }
    }
});
