/**
  * Copyright 2017, GeoSolutions Sas.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree.
  */

import { withProps } from 'recompose';

import DefaultFilterComp from './DefaultFilter';
import StringFilterComp from './StringFilter';
import NumberFilterComp from './NumberFilter';
import DateTimeFilterComp from './DateTimeFilter';

export const DefaultFilter = DefaultFilterComp;
export const StringFilter = StringFilterComp;
export const NumberFilter = NumberFilterComp;
export const DateTimeFilter = DateTimeFilterComp;

export const types = {
    "defaultFilter": (type) => withProps(() =>({type: type}))(DefaultFilter),
    "string": () => StringFilter,
    "number": () => NumberFilter,
    "int": () => NumberFilter,
    "date": () => withProps(() =>({type: "date"}))(DateTimeFilter),
    "time": () => withProps(() =>({type: "time"}))(DateTimeFilter),
    "date-time": () => withProps(() =>({type: "date-time"}))(DateTimeFilter)
};

export const getFilterRenderer = (type, props) => types[type] ? types[type](type, props) : types.defaultFilter(type, props);
