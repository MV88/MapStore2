/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { createSelector } from 'reselect';
import { push } from 'connected-react-router';
import { Button } from 'react-bootstrap';
import { get } from 'lodash';
import withMask from '../components/misc/enhancers/withMask';
import { isLoggedIn } from '../selectors/security';
import Message from '../components/I18N/Message';
import ResourceUnavailable from '../components/errors/ResourceUnavailable';
import { feedbackMaskSelector } from '../selectors/feedbackmask';

const feedbackMaskPluginSelector = createSelector([
    feedbackMaskSelector,
    isLoggedIn,
    state => !get(state, 'security')
], ({loading, enabled, status, mode, errorMessage}, login, alwaysVisible) => ({
    loading,
    enabled,
    status,
    mode,
    errorMessage,
    login,
    alwaysVisible,
    showHomeButton: !alwaysVisible
}));

const HomeButton = connect(() => ({}), {
    onClick: push.bind(null, '/')
})(
    ({onClick = () => {}}) => <Button
        bsStyle="primary"
        onClick={() => onClick()}>
        <Message msgId="gohome"/>
    </Button>
);

/**
 * FeedbackMask plugin.
 * Create a mask on dashboard and map pages when they are not accessible or not found.
 * @memberof plugins
 * @name FeedbackMask
 * @class
 * @prop {string} cfg.loadingText change loading text
 */

const FeedbackMaskPlugin = compose(
    connect(feedbackMaskPluginSelector),
    withMask(
        ({loading, enabled}) => loading || enabled,
        props => props.loading ?
            <span>
                <div className="_ms2_init_spinner _ms2_init_center">
                    <div/>
                </div>
                <div className="_ms2_init_text _ms2_init_center">
                    {props.loadingText || props.mode && <Message msgId={`${props.mode}.loadingSpinner`}/> || 'Loading MapStore'}
                </div>
            </span>
            :
            <ResourceUnavailable {...props} homeButton={<HomeButton />} />, {
            className: 'ms2-loading-mask'
        })
)(() => null);

export default {
    FeedbackMaskPlugin,
    reducers: {
        feedbackMask: require('../reducers/feedbackMask')
    },
    epics: require('../epics/feedbackMask')
};
