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
// enhancers for dependencies management
import dependenciesToExtent from '../enhancers/dependenciesToExtent';
import dependenciesToLayers from '../enhancers/dependenciesToLayers';
import dependenciesToFilter from '../enhancers/dependenciesToFilter';
import dependenciesToMapProp from '../enhancers/dependenciesToMapProp';
import dependenciesToOptions from '../enhancers/dependenciesToOptions';
import dependenciesToWidget from '../enhancers/dependenciesToWidget';
import legendWidget from '../enhancers/legendWidget';
import mapWidget from '../enhancers/mapWidget';
import tableWidget from '../enhancers/tableWidget';
import textWidget from '../enhancers/textWidget';
import wfsTable from '../enhancers/wfsTable';
// Enhancers for ajax support
import wpsChart from '../enhancers/wpsChart';
import wpsCounter from '../enhancers/wpsCounter';
//
// connect widgets to dependencies, remote services and add base icons/tools
//
import ChartWidgetComp from './ChartWidget';
import CounterWidgetComp from './CounterWidget';
import LegendWidgetComp from './LegendWidget';
import MapWidgetComp from './MapWidget';
import TableWidgetComp from './TableWidget';
import TextWidgetComp from './TextWidget';

const ChartWidget = compose(
    dependenciesToWidget,
    dependenciesToFilter,
    dependenciesToOptions,
    wpsChart,
    chartWidget
)(ChartWidgetComp);

const TextWidget = compose(
    textWidget
)(TextWidgetComp);

const MapWidget = compose(
    dependenciesToWidget,
    dependenciesToLayers,
    dependenciesToMapProp('center'),
    dependenciesToMapProp('zoom'),
    dependenciesToExtent,
    mapWidget
)(MapWidgetComp);

const TableWidget = compose(
    dependenciesToWidget,
    dependenciesToOptions,
    dependenciesToFilter,
    wfsTable,
    tableWidget,
)(TableWidgetComp);

const CounterWidget = compose(
    dependenciesToWidget,
    dependenciesToFilter,
    dependenciesToOptions,
    wpsCounter,
    counterWidget
)(CounterWidgetComp);

const LegendWidget = compose(
    dependenciesToWidget,
    legendWidget
)(LegendWidgetComp);

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
