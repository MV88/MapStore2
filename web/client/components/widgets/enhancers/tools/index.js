/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { compose } from 'recompose';

import collapsibleWidgetTool from './collapsibleWidget';
import editableWidgetTool from './editableWidget';
import exportableWidgetTool from './exportableWidget';
import hidableWidgetTool from './hidableWidget';
import pinnableWidgetTool from './pinnableWidget';
import withIconsTool from './withIcons';
import withInfoTool from './withInfo';
import withMenuTool from './withMenu';
import withToolsTool from './withTools';

export const withTools = withToolsTool;
export const pinnableWidget = pinnableWidgetTool;
export const hidableWidget = hidableWidgetTool;
export const withMenu = withMenuTool;
export const withIcons = withIconsTool;
export const editableWidget = editableWidgetTool;
export const exportableWidget = exportableWidgetTool;
export const collapsibleWidget = collapsibleWidgetTool;


/**
     * widgets icons of collapse/pin
     */
export const defaultIcons = () => compose(
    pinnableWidget(),
    collapsibleWidget(),
    withInfoTool()
);
    /**
     * transform `widgetTools` prop into `topLeftItems` and `icons` props
     * user to in the widget header
     */
export const withHeaderTools = () => compose(
    withTools(),
    withIcons(),
    withMenu()
);
