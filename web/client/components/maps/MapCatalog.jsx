/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { compose } from 'recompose';
import { isNil } from 'lodash';
import Message from '../I18N/Message';
import MapCatalogForm from './MapCatalogForm';
import BorderLayout from '../layout/BorderLayout';
import LoadingSpinner from '../misc/LoadingSpinner';
import loadingState from '../misc/enhancers/loadingState';
import emptyState from '../misc/enhancers/emptyState';

const SideGrid = compose(
    loadingState(({ loading, items = [] }) => items.length === 0 && loading),
    emptyState(
        ({ loading, items = [] }) => items.length === 0 && !loading,
        {
            title: <Message msgId="catalog.noRecordsMatched" />,
            style: { transform: "translateY(50%)" }
        })

)(require('../misc/cardgrids/SideGrid'));
export default ({ setSearchText = () => { }, selected, skip = 0, onSelected, loading, searchText, items = [], total, title = <Message msgId={"maps.title"} /> }) => {
    return (<BorderLayout
        className="map-catalog"
        header={<MapCatalogForm title={title} searchText={searchText} onSearchTextChange={setSearchText} />}
        footer={<div className="catalog-footer">
            <span>{loading ? <LoadingSpinner /> : null}</span>
            {!isNil(total) ?
                <span className="res-info"><Message msgId="catalog.pageInfoInfinite"
                    msgParams={{ loaded: items.length - skip, total }} /></span> : null}
        </div>}>
        <SideGrid
            items={items.map(i =>
                i === selected
                    || selected
                    && i && i.map
                    && selected.id === i.map.id
                    ? { ...i, selected: true }
                    : i)}
            loading={loading}
            onItemClick={({ map } = {}) => onSelected(map)} />
    </BorderLayout>);
};


