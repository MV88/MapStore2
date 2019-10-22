/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { connect } from 'react-redux';

import { searchGeostories } from '../../actions/geostories';
import { withHandlers, renameProp, compose } from 'recompose';

import {
    searchTextSelector,
    resultsSelector,
    searchParamsSelector,
    totalCountSelector,
    isLoadingSelector
} from '../../selectors/geostories';
import PaginationToolbarComp from '../../components/misc/PaginationToolbar';
import { createSelector } from 'reselect';
const PaginationToolbar = compose(
    connect(
        createSelector(
            searchTextSelector,
            searchParamsSelector,
            resultsSelector,
            totalCountSelector,
            isLoadingSelector,
            () => false, // TODO: loading
            (searchText, { start = 0, limit = 12 } = {}, results, totalCount, loading) => {
                const total = Math.min(totalCount || 0, limit || 0);
                const page = results && total && Math.ceil(start / total) || 0;
                return {
                    page: page,
                    pageSize: limit,
                    items: results,
                    total: totalCount,
                    searchText,
                    loading
                };
            }
        ),
        {
            searchGeostories
        }
    ),
    renameProp('searchGeostories', 'loadPage'),
    withHandlers({
        onSelect: ({ loadPage = () => { }, searchText, pageSize }) => (pageNumber) => {
            let start = pageSize * pageNumber;
            let limit = pageSize;
            loadPage(searchText, { start, limit });
        }
    })
)(PaginationToolbarComp);
export default PaginationToolbar;
