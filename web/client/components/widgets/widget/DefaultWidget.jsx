/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { compose } from 'recompose';

// enhancers for base menus and functionalities
import chartWidget from '../enhancers/chartWidget';

import counterWidget from '../enhancers/counterWidget';
import tableWidget from '../enhancers/tableWidget';
import legendWidget from '../enhancers/legendWidget';
import textWidget from '../enhancers/textWidget';
import mapWidget from '../enhancers/mapWidget';

// Enhancers for ajax support
import wpsChart from '../enhancers/wpsChart';

import wpsCounter from '../enhancers/wpsCounter';
import wfsTable from '../enhancers/wfsTable';

// enhancers for dependencies management
import dependenciesToFilter from '../enhancers/dependenciesToFilter';

import dependenciesToOptions from '../enhancers/dependenciesToOptions';
import dependenciesToWidget from '../enhancers/dependenciesToWidget';
import dependenciesToMapProp from '../enhancers/dependenciesToMapProp';
//
// connect widgets to dependencies, remote services and add base icons/tools
//
const ChartWidget = compose(
    dependenciesToWidget,
    dependenciesToFilter,
    dependenciesToOptions,
    wpsChart,
    chartWidget
)(require('./ChartWidget'));

const TextWidget = compose(
    textWidget
)(require('./TextWidget'));

const MapWidget = compose(
    dependenciesToWidget,
    dependenciesToMapProp('center'),
    dependenciesToMapProp('zoom'),
    mapWidget
)(require('./MapWidget'));

const TableWidget = compose(
    dependenciesToWidget,
    dependenciesToOptions,
    dependenciesToFilter,
    wfsTable,
    tableWidget,
)(require('./TableWidget'));

const CounterWidget = compose(
    dependenciesToWidget,
    dependenciesToFilter,
    dependenciesToOptions,
    wpsCounter,
    counterWidget
)(require("./CounterWidget"));

const LegendWidget = compose(
    dependenciesToWidget,
    legendWidget
)(require("./LegendWidget"));

/**
 * Renders proper widget by widgetType, binding props and methods
 */
export default ({
    dependencies,
    toggleCollapse = () => {},
    exportCSV = () => {},
    exportImage = () => {},
    onDelete = () => {},
    onEdit = () => {},
    ...w
} = {}) => w.widgetType === "text"
    ? (<TextWidget {...w}
        toggleCollapse={toggleCollapse}
        onDelete={onDelete}
        onEdit={onEdit}/>)
    : w.widgetType === "table"
        ? <TableWidget {...w}
            toggleCollapse={toggleCollapse}
            exportCSV={exportCSV}
            dependencies={dependencies}
            onDelete={onDelete}
            onEdit={onEdit}
        />
        : w.widgetType === "counter"
            ? <CounterWidget {...w}
                toggleCollapse={toggleCollapse}
                dependencies={dependencies}
                onDelete={onDelete}
                onEdit={onEdit} />
            : w.widgetType === "map"
                ? <MapWidget {...w}
                    toggleCollapse={toggleCollapse}
                    dependencies={dependencies}
                    onDelete={onDelete}
                    onEdit={onEdit} />
                : w.widgetType === "legend"
                    ? <LegendWidget {...w}
                        toggleCollapse={toggleCollapse}
                        dependencies={dependencies}
                        onDelete={onDelete}
                        onEdit={onEdit} />
                    : (<ChartWidget {...w}
                        toggleCollapse={toggleCollapse}
                        exportCSV={exportCSV}
                        dependencies={dependencies}
                        exportImage={exportImage}
                        onDelete={onDelete}
                        onEdit={onEdit} />);
