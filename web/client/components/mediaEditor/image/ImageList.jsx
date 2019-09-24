/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import withFilter from '../../misc/enhancers/withFilter';

import withLocal from "../../misc/enhancers/localizedProps";
import Filter from '../../misc/Filter';
import SideGrid from '../../misc/cardgrids/SideGrid';
import { filterResources } from '../../../utils/GeoStoryUtils';

const FilterLocalized = withLocal('filterPlaceholder')(Filter);

export default withFilter(({
    filterText,
    resources = [],
    selectedItem,
    onFilter = () => {},
    selectItem = () => {}
}) => (
<div className="ms-imageList">
    <FilterLocalized
        className="ms-image-filter"
        filterPlaceholder="mediaEditor.mediaPicker.imageFilter"
        filterText={filterText}
        onFilter={onFilter}/>
    <SideGrid
        items={filterResources(resources, filterText).map(({ id, data = {}}) => ({
            preview: <div
                style={{
                    background: `url("${data.src}")`,
                    backgroundSize: 'cover',
                    height: "100%",
                    overflow: 'hidden'
                }} />,
            title: data.title,
            onClick: () => selectItem(id),
            selected: selectedItem && selectedItem.id && id === selectedItem.id,
            description: data.description
        }))} />
</div>));
