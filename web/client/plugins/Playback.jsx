/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assign from 'object-assign';
import React from 'react';
import { connect } from 'react-redux';
import { compose, defaultProps } from 'recompose';
import { createSelector } from 'reselect';

import { STATUS, pause, play, stop } from '../actions/playback';
import epics from '../epics/playback';
import dimension from '../reducers/dimension';
import playback from '../reducers/playback';
import { currentTimeSelector } from '../selectors/dimension';
import { loadingSelector, statusSelector } from '../selectors/playback';
import PlaybackComp from './playback/Playback';

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
)(PlaybackComp);

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
    epics,
    reducers: {
        playback,
        dimension
    }
};
