/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { connect } from 'react-redux';

import { compose } from 'recompose';
import { createSelector } from 'reselect';
import { userSelector } from '../../selectors/security';
import { widgetsConfig } from '../../selectors/widgets';

import {
    isShowSaveOpen,
    dashboardResource,
    isDashboardLoading,
    getDashboardSaveErrors
} from '../../selectors/dashboard';

import { saveDashboard, triggerSave } from '../../actions/dashboard';
import handleSaveModal from '../../components/resources/modals/enhancers/handleSaveModal';
import Save from '../../components/resources/modals/Save';

/**
 * Save dialog component enhanced for dashboard
 *
 */
export default compose(
    connect(createSelector(
        isShowSaveOpen,
        dashboardResource,
        widgetsConfig,
        userSelector,
        isDashboardLoading,
        getDashboardSaveErrors,
        (show, resource, data, user, loading, errors ) => ({ show, resource, data, user, loading, errors })
    ), {
        onClose: () => triggerSave(false),
        onSave: saveDashboard
    }),
    handleSaveModal
)(Save);
