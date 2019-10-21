/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { hide, dispatchAction } from '../actions/notifications';

import { clearNotificationOnLocationChange } from '../epics/notifications';
import { connect } from 'react-redux';


/**
  * Notifications Plugin. Provides support to show notifications
  * @class  Notifications
  * @memberof plugins
  * @static
  * @example
  * {name: "Notifications"}
  *
  */
export default {
    NotificationsPlugin: connect(
        (state) => ({ notifications: state && state.notifications}),
        {
            onRemove: hide,
            onDispatch: dispatchAction
        }
    )(require('../components/notifications/NotificationContainer')),
    reducers: {
        notifications: require('../reducers/notifications')
    },
    epics: {
        clearNotificationOnLocationChange
    }
};
