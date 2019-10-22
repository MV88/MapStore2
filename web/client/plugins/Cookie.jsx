/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';

import { setCookieVisibility, setMoreDetailsVisibility } from '../actions/cookie';
import CookieComp from '../components/cookie/Cookie';
import cookiesComp from '../epics/cookies';
import cookie from '../reducers/cookie';
const Cookie = connect((state) => ({
    show: state.cookie && state.cookie.showCookiePanel,
    html: state.cookie && state.cookie.html && state.cookie.html[state.locale && state.locale.current],
    seeMore: state.cookie && state.cookie.seeMore
}), {
    onSetCookieVisibility: setCookieVisibility,
    onMoreDetails: setMoreDetailsVisibility
})(CookieComp);

export default {
    CookiePlugin: Cookie,
    reducers: {cookie},
    epics: cookiesComp
};
