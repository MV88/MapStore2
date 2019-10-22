/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { connect } from 'react-redux';

import { loadLocale } from '../actions/locale';
import assign from 'object-assign';
import LangBarComp from '../components/I18N/LangBar';


const LangBar = connect((state) => ({
    currentLocale: state.locale && state.locale.current
}), {
    onLanguageChange: loadLocale.bind(null, null)
})(LangBarComp);

export default {
    LanguagePlugin: assign(LangBar, {
        OmniBar: {
            name: 'language',
            position: 4,
            tool: true,
            priority: 1
        }
    }),
    reducers: {}
};
