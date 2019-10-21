/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { connect } from 'react-redux';

import { changeHelpwinVisibility, changeHelpText } from '../../actions/help';

export default connect((state) => ({
    helpEnabled: state.controls && state.controls.help && state.controls.help.enabled
}), {
    changeHelpText,
    changeHelpwinVisibility
})(require('../../components/help/HelpWrapper'));
