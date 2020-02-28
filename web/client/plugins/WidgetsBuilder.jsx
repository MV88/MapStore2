/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { createSelector } from 'reselect';

import { setControlProperty } from '../actions/controls';
import { toggleConnection } from '../actions/widgets';
import DockPanel from '../components/misc/panels/DockPanel';
import epics from '../epics/widgetsbuilder';
import { widgetBuilderSelector } from '../selectors/controls';
import { mapLayoutValuesSelector } from '../selectors/maplayout';
import { availableDependenciesSelector, dependenciesSelector } from '../selectors/widgets';
import WidgetTypeBuilder from './widgetbuilder/WidgetTypeBuilder';
import withMapExitButton from './widgetbuilder/enhancers/withMapExitButton';

const Builder = compose(
    connect(
        createSelector(
            dependenciesSelector,
            availableDependenciesSelector,
            (dependencies, availableDependenciesProps) => ({ dependencies, ...availableDependenciesProps }))
        , { toggleConnection }),
    withMapExitButton
)(WidgetTypeBuilder);

class SideBarComponent extends React.Component {
     static propTypes = {
         id: PropTypes.string,
         enabled: PropTypes.bool,
         limitDockHeight: PropTypes.bool,
         fluid: PropTypes.bool,
         zIndex: PropTypes.number,
         dockSize: PropTypes.number,
         position: PropTypes.string,
         onMount: PropTypes.func,
         onUnmount: PropTypes.func,
         onClose: PropTypes.func,
         dimMode: PropTypes.string,
         src: PropTypes.string,
         style: PropTypes.object,
         layout: PropTypes.object,
         shortenChartLabelThreshold: PropTypes.number
     };
     static defaultProps = {
         id: "widgets-builder-plugin",
         enabled: false,
         dockSize: 500,
         limitDockHeight: true,
         zIndex: 10000,
         fluid: false,
         dimMode: "none",
         position: "left",
         shortenChartLabelThreshold: 1000,
         onMount: () => {},
         onUnmount: () => {},
         onClose: () => {},
         layout: {}
     };
     componentDidMount() {
         this.props.onMount();
     }

     componentWillUnmount() {
         this.props.onUnmount();
     }
     render() {
         return (
             <DockPanel
                 open={this.props.enabled}
                 size={this.props.dockSize}
                 zIndex={this.props.zIndex}
                 position={this.props.position}
                 bsStyle="primary"
                 hideHeader
                 style={{...this.props.layout, background: "white"}}>
                 <Builder
                     enabled={this.props.enabled}
                     onClose={this.props.onClose}
                     typeFilter={({ type } = {}) => type !== 'map' && type !== 'legend'}
                     shortenChartLabelThreshold={this.props.shortenChartLabelThreshold}/>
             </DockPanel>);

     }
}
/**
 * Editor for map widgets
 * @memberof plugins
 * @name WidgetsBuilder
 * @class
 *
 */
const Plugin = connect(
    createSelector(
        widgetBuilderSelector,
        state => mapLayoutValuesSelector(state, {height: true}),
        (enabled, layout) => ({
            enabled,
            layout
        })), {
        onMount: () => setControlProperty("widgetBuilder", "available", true),
        onUnmount: () => setControlProperty("widgetBuilder", "available", false),
        onClose: setControlProperty.bind(null, "widgetBuilder", "enabled", false, false)
    }

)(SideBarComponent);
export default {
    WidgetsBuilderPlugin: Plugin,
    epics
};
