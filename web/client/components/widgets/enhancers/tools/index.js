/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { compose } from 'recompose';

import withTools from './withTools';
import pinnableWidget from './pinnableWidget';
import hidableWidget from './hidableWidget';
import withInfo from './withInfo';
import withMenu from './withMenu';
import withIcons from './withIcons';
import editableWidget from './editableWidget';
import exportableWidget from './exportableWidget';
import collapsibleWidget from './collapsibleWidget';


export default {
    withTools,
    pinnableWidget,
    hidableWidget,
    withMenu,
    withIcons,
    editableWidget,
    exportableWidget,
    collapsibleWidget,
    /**
     * widgets icons of collapse/pin
     */
    defaultIcons: () => compose(
        pinnableWidget(),
        collapsibleWidget(),
        withInfo()
    ),
    /**
     * transform `widgetTools` prop into `topLeftItems` and `icons` props
     * user to in the widget header
     */
    withHeaderTools: () => compose(
        withTools(),
        withIcons(),
        withMenu()
    )
};
