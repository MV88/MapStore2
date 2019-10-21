/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { compose, defaultProps, withProps } from 'recompose';

import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { filterHiddenWidgets } from './widgetsPermission';
import { toggleCollapse } from '../../actions/widgets';
import { trayWidgets } from '../../selectors/widgetsTray';


/**
 * Button bar with the list of all the widgets to minimize/expand.
 * note: hides some widgets to user that do not have access too, using `filterHiddenWidgets` enhancer.
 */
export default compose(
    connect(
        createSelector(
            trayWidgets,
            widgets => ({ widgets })
        ),
        {
            onClick: toggleCollapse
        }
    ),
    defaultProps({
        btnGroupProps: {
            className: "widgets-toolbar",
            style: { marginLeft: 2, marginRight: 2 }
        }
    }),
    filterHiddenWidgets,
    withProps(({ btnGroupProps = {}, btnDefaultProps = {} }) => ({
        btnGroupProps: {
            bsSize: "xsmall",
            ...btnGroupProps
        },
        btnDefaultProps: {
            bsSize: "xsmall",
            ...(btnDefaultProps || {})
        }
    }))
)(require('../../components/widgets/view/WidgetsBar'));
