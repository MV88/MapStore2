/*
* Copyright 2019, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/
import React from 'react';

import PropTypes from 'prop-types';
import assign from 'object-assign';
import { connect } from 'react-redux';
import Message from '../components/I18N/Message';
import emptyState from '../components/misc/enhancers/emptyState';
import { setGeostoriesAvailable } from '../actions/geostories';
import { mapTypeSelector } from '../selectors/maptype';
import { userRoleSelector } from '../selectors/security';
import { isFeaturedMapsEnabled } from '../selectors/featuredmaps';
import { totalCountSelector } from '../selectors/geostories';
import { createSelector } from 'reselect';
import { compose } from 'recompose';
import GeostoryGrid from './geostories/GeostoriesGrid';
import PaginationToolbar from './geostories/PaginationToolbar';
import EmptyGeostoriesView from './geostories/EmptyGeostoriesView';

const geostoriesCountSelector = createSelector(
    totalCountSelector,
    count => ({ count })
);


class Geostories extends React.Component {
    static propTypes = {
        mapType: PropTypes.string,
        title: PropTypes.any,
        onMount: PropTypes.func,
        loadGeostories: PropTypes.func,
        resources: PropTypes.array,
        searchText: PropTypes.string,
        mapsOptions: PropTypes.object,
        colProps: PropTypes.object,
        fluid: PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object
    };

    static defaultProps = {
        mapType: "leaflet",
        onMount: () => {},
        loadGeostories: () => {},
        fluid: false,
        title: <h3><Message msgId="resources.geostories.titleNoCount" /></h3>,
        mapsOptions: {start: 0, limit: 12},
        colProps: {
            xs: 12,
            sm: 6,
            lg: 3,
            md: 4,
            className: 'ms-map-card-col'
        },
        maps: []
    };

    componentDidMount() {
        this.props.onMount();
    }

    render() {
        return (<GeostoryGrid
            resources={this.props.resources}
            fluid={this.props.fluid}
            title={this.props.title}
            colProps={this.props.colProps}
            viewerUrl={(geostory) => {this.context.router.history.push(`geostory/${geostory.id}`); }}
            bottom={<PaginationToolbar />}
        />);
    }
}

const geostoriesPluginSelector = createSelector([
    mapTypeSelector,
    state => state.geostories && state.geostories.searchText,
    state => state.geostories && state.geostories.results ? state.geostories.results : [],
    isFeaturedMapsEnabled,
    userRoleSelector
], (mapType, searchText, resources, featuredEnabled, role) => ({
    mapType,
    searchText,
    resources: resources.map(res => ({...res, featuredEnabled: featuredEnabled && role === 'ADMIN'})) // TODO: remove false to enable featuredEnabled
}));

const GeoStoriesPlugin = compose(
    connect(geostoriesPluginSelector, {
        onMount: () => setGeostoriesAvailable(true)
    }),
    emptyState(
        ({resources = [], loading}) => !loading && resources.length === 0,
        () => ({
            glyph: "geostory",
            title: <Message msgId="resources.geostories.noGeostoryAvailable" />,
            description: <EmptyGeostoriesView />
        })

    )
)(Geostories);

export default {
    GeoStoriesPlugin: assign(GeoStoriesPlugin, {
        NavMenu: {
            position: 3,
            label: <Message msgId="resources.geostories.menuText" />,
            linkId: '#mapstore-geostories-grid',
            glyph: 'geostory'
        },
        ContentTabs: {
            name: 'geostories',
            key: 'geostories',
            TitleComponent:
                connect(geostoriesCountSelector)(({ count = ""}) => <Message msgId="resources.geostories.title" msgParams={{ count: count + "" }} />),
            position: 3,
            tool: true,
            priority: 1
        }
    }),
    epics: require('../epics/geostories'),
    reducers: {
        geostories: require('../reducers/geostories')
    }
};
