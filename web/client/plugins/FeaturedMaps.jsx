/*
* Copyright 2018, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';

import PropTypes from 'prop-types';
import assign from 'object-assign';
import { defaultProps, compose, mapPropsStream } from 'recompose';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { NavItem, Glyphicon } from 'react-bootstrap';
import { setFeaturedMapsEnabled } from '../actions/maps';
import Message from '../components/I18N/Message';
import maptypeEpics from '../epics/maptype';
import mapsEpics from '../epics/maps';
import { userRoleSelector } from '../selectors/security';
import { mapTypeSelector } from '../selectors/maptype';
import { resourceSelector, searchTextSelector, isFeaturedMapsEnabled } from '../selectors/featuredmaps';
import { loadPage, updateItemsLifecycle } from '../components/maps/enhancers/featuredMaps';
import gridPagination from '../components/misc/enhancers/gridPagination';
import tooltip from '../components/misc/enhancers/tooltip';
import MapsGrid from './maps/MapsGrid';
import MetadataModal from './maps/MetadataModal';
import { scrollIntoViewId } from '../utils/DOMUtil';
import featuredmaps from '../reducers/featuredmaps';
import maptype from '../reducers/maptype';
import currentMap from '../reducers/currentMap';
const ToolTipedNavItem = tooltip(NavItem);

const PAGE_SIZE = 4;

class FeaturedMaps extends React.Component {

    static propTypes = {
        mapType: PropTypes.string,
        items: PropTypes.array,
        colProps: PropTypes.object,
        fluid: PropTypes.bool,
        bottom: PropTypes.node,
        className: PropTypes.string,
        previousItems: PropTypes.array,
        enableFeaturedMaps: PropTypes.func
    };

    static contextTypes = {
        router: PropTypes.object
    };


    UNSAFE_componentWillMount() {
        this.props.enableFeaturedMaps(true);
    }

    render() {
        const items = this.props.items.length > 0 && this.props.items || this.props.previousItems || [];
        return (
            <MapsGrid
                id="ms-featured-maps"
                fluid={this.props.fluid}
                className={this.props.className}
                title={<h3><Message msgId="manager.featuredMaps" /></h3>}
                maps={items}
                colProps={this.props.colProps}
                viewerUrl={(res) => {
                    if (res.category && res.category.name === "DASHBOARD") {
                        return this.context.router.history.push(`/dashboard/${res.id}`);
                    }
                    if (res.category && res.category.name === "GEOSTORY") {
                        return this.context.router.history.push(`/geostory/${res.id}`);
                    }
                    return this.context.router.history.push("/viewer/" + this.props.mapType + "/" + res.id);
                }}
                metadataModal={MetadataModal}
                bottom={this.props.bottom}
                style={items.length === 0 ? {display: 'none'} : {}}/>
        );
    }
}

const featuredMapsPluginSelector = createSelector([
    mapTypeSelector,
    userRoleSelector,
    state => state.browser && state.browser.mobile,
    searchTextSelector,
    resourceSelector,
    isFeaturedMapsEnabled
], (mapType, role, isMobile, searchText, resource, isFeaturedEnabled) => ({
    mapType,
    role,
    permission: role === 'ADMIN',
    pagination: isMobile ? 'virtual-scroll-horizontal' : 'show-more',
    searchText,
    resource,
    isFeaturedEnabled
}));

const updateFeaturedMapsStream = mapPropsStream(props$ =>
    props$.merge(props$.take(1).switchMap(({searchText = '', permission, viewSize, pageSize, loadFirst = () => {} }) => {
        return props$
            .startWith({searchText, permission, viewSize, pageSize, loading: true})
            .distinctUntilChanged((previous, next) =>
                isEqual(previous.resource, next.resource)
                && previous.searchText === next.searchText
                && previous.permission === next.permission
                && previous.role === next.role
            )
            .do(({permission: newPermission, viewSize: newViewSize, searchText: newSearchText, pageSize: newPageSize} = {}) =>
                loadFirst({permission: newPermission, viewSize: newViewSize, searchText: newSearchText, pageSize: newPageSize})
            )
            .ignoreElements();
    })));

/**
 * FeaturedMaps plugin. Shows featured maps in a grid.
 * @prop {string} cfg.pageSize change the page size (only desktop)
 * @memberof plugins
 * @class
 */

const FeaturedMapsPlugin = compose(
    connect(featuredMapsPluginSelector, {
        enableFeaturedMaps: setFeaturedMapsEnabled
    }),
    defaultProps({
        mapType: 'leaflet',
        onGoToMap: () => {},
        fluid: false,
        mapsOptions: {start: 0, limit: 12},
        colProps: {
            xs: 12,
            sm: 6,
            lg: 3,
            md: 4,
            className: 'ms-map-card-col'
        },
        items: [],
        pageSize: PAGE_SIZE,
        skip: 0,
        total: 0,
        viewSize: PAGE_SIZE,
        onChangeSize: () => {},
        onLoadMore: () => {},
        loading: false,
        className: '',
        previousItems: [],
        searchText: ''
    }),
    gridPagination({loadPage, pageSize: PAGE_SIZE}),
    updateItemsLifecycle,
    updateFeaturedMapsStream
)((FeaturedMaps));

const LabeledNavItem = connect(featuredMapsPluginSelector)(({ isFeaturedEnabled }) =>
    isFeaturedEnabled ? (<NavItem
        target="_blank"
        onClick={() => scrollIntoViewId('ms-featured-maps')}
    >
        <Message msgId="manager.featuredMaps" />
    </NavItem>) : null);

const IconNavItem = connect(featuredMapsPluginSelector)(({ isFeaturedEnabled }) =>
    isFeaturedEnabled ? (<ToolTipedNavItem
        target="_blank"
        tooltip={<Message msgId="manager.featuredMaps" />}
        tooltipPosition="bottom"
        onClick={() => scrollIntoViewId('ms-featured-maps')}
    >
        <Glyphicon glyph="star" />
    </ToolTipedNavItem>) : null);

export default {
    FeaturedMapsPlugin: assign(FeaturedMapsPlugin, {
        NavMenu: {
            position: 1,
            labelComponent: <LabeledNavItem key="featured-maps-label"/>,
            iconComponent: <IconNavItem key="featured-maps-icon"/>
        }
    }),
    epics: {
        ...maptypeEpics,
        ...mapsEpics
    },
    reducers: {
        featuredmaps,
        maptype,
        currentMap
    }
};
