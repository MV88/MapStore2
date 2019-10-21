/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import assign from 'object-assign';
import { defaultProps, compose } from 'recompose';
import { createSelector } from 'reselect';
import { play, pause, stop, STATUS } from '../actions/playback';
import { currentTimeSelector } from '../selectors/dimension';
import { statusSelector, loadingSelector } from '../selectors/playback';
import { connect } from 'react-redux';

const Playback = compose(
    defaultProps({
        statusMap: STATUS
    }),
    connect(
        createSelector(
            statusSelector,
            currentTimeSelector,
            loadingSelector,
            (status, currentTime, loading) => ({
                loading,
                currentTime,
                status
            })
        ), {
            play,
            pause,
            stop
        }
    )
)(require('./playback/Playback'));

/**
  * Playback Plugin. Shows the playback controls for @see {@link api/plugins#plugins.Timeline}
  * @class  Playback
  * @memberof plugins
  * @static
  */
class PlaybackPlugin extends React.Component {
    render() {
        return (
            <div className={"playback-plugin"}>
                <Playback {...this.props}/>
            </div>
        );
    }
}

export default {
    PlaybackPlugin: assign(PlaybackPlugin, {
        disablePluginIf: "{state('featuregridmode') === 'EDIT'}",
        Timeline: {
            name: 'playback',
            position: 1,
            priority: 1
        }
    }),
    epics: require('../epics/playback'),
    reducers: {
        playback: require('../reducers/playback'),
        dimension: require('../reducers/dimension')
    }
};
