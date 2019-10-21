/**
  * Copyright 2017, GeoSolutions Sas.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree.
  */

import { withProps } from 'recompose';

import DefaultFilter from './DefaultFilter';
import StringFilter from './StringFilter';
import NumberFilter from './NumberFilter';
import DateTimeFilter from './DateTimeFilter';

const types = {
    "defaultFilter": (type) => withProps(() =>({type: type}))(DefaultFilter),
    "string": () => StringFilter,
    "number": () => NumberFilter,
    "int": () => NumberFilter,
    "date": () => withProps(() =>({type: "date"}))(DateTimeFilter),
    "time": () => withProps(() =>({type: "time"}))(DateTimeFilter),
    "date-time": () => withProps(() =>({type: "date-time"}))(DateTimeFilter)
};
export default {
    getFilterRenderer: (type, props) => types[type] ? types[type](type, props) : types.defaultFilter(type, props),
    DefaultFilter,
    StringFilter,
    NumberFilter,
    DateTimeFilter
};
