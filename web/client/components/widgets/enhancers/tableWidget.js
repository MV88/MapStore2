/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { compose, withPropsOnChange } from 'recompose';

import { get } from 'lodash';
import { editableWidget, withHeaderTools, defaultIcons } from './tools';
/**
 * enhancer that updates widget column size on resize. and add base icons and menus
 * Moreover enhances it to allow delete.
*/
export default compose(
    withPropsOnChange(["gridEvents"], ({ gridEvents = {}, updateProperty = () => { } } = {}) => ({
        gridEvents: {
            ...gridEvents,
            onColumnResize:
                (colIdx, width, rg, d, a, columns) =>
                    updateProperty(`options.columnSettings["${get(columns.filter(c => !c.hide)[colIdx], "name")}"].width`, width)
        }
    })),
    require('./deleteWidget'),
    editableWidget(),
    defaultIcons(),
    withHeaderTools()
);
