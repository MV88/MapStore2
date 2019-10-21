/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import Message from '../../components/I18N/Message';
import { defaultProps } from 'recompose';
export default
    defaultProps({
        title: <Message msgId="widgets.builder.wizard.selectALayer" />
    })(require('../../components/catalog/CompactCatalog'));
