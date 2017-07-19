/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const PropTypes = require('prop-types');
const AdaptiveGrid = require('../../misc/AdaptiveGrid');
const editors = require('./editors');
const {featureTypeToGridColumns, getToolColumns, getRow, getGridEvents, isValidValueForPropertyName, isProperty} = require('../../../utils/FeatureGridUtils');
require("./featuregrid.css");
/**
 * A component that gets the describeFeatureType and the features to display
 * attributes
 * @class
 * @memberof components.data.featuregrid
 * @prop {geojson[]} features array of geojson features
 * @prop {object} describeFeatureType the describeFeatureType in json format
 * @prop {Component} gridComponent the grid component, if different from AdaptiveGrid
 * @prop {object} gridOptions to pass to the grid
 * @prop {object} gridEvents an object with events for the grid. Note: onRowsSelected, onRowsDeselected and onRowsToggled will be associated automatically from this object
 * to the rowSelection tool. If checkbox are enabled, onRowsSelected and onRowsDeselected will be triggered. If showCheckbox is false, onRowsToggled will be triggered.
 * @prop {object[]} tools. a list of tools. the format is the react-data-grid column format but with the following differences:
 * - The events are automatically binded to call the related callback with the feature as first parameter, second argument is the same, no original event is passed. describeFeatureType as third
 */
class FeatureGrid extends React.PureComponent {
    static propTypes = {
        gridOpts: PropTypes.object,
        changes: PropTypes.object,
        selectBy: PropTypes.object,
        features: PropTypes.array,
        editable: PropTypes.bool,
        showDragHandle: PropTypes.bool,
        gridComponent: PropTypes.func,
        describeFeatureType: PropTypes.object,
        columnSettings: PropTypes.object,
        gridOptions: PropTypes.object,
        actionOpts: PropTypes.object,
        tools: PropTypes.array,
        gridEvents: PropTypes.object
    };
    static childContextTypes = {
        isModified: React.PropTypes.func,
        isValid: React.PropTypes.func,
        isProperty: React.PropTypes.func
    };
    static defaultProps = {
        gridComponent: AdaptiveGrid,
        changes: {},
        gridEvents: {},
        gridOpts: {},
        describeFeatureType: {},
        columnSettings: {},
        features: [],
        tools: [],
        editable: false,
        showDragHandle: false
    };
    constructor(props) {
        super(props);
        this.rowGetter = (i) => {
            const orig = getRow(i, this.props.features);
            const featureChanges = this.props.changes && this.props.changes[orig.id] || {};
            const propChanges = Object.keys(featureChanges).filter(k => k !== "geometry").reduce((acc, cur) => ({
                ...acc,
                [cur]: featureChanges[cur]
            }), {});
            let feature = {
                ...orig,
                geometry: featureChanges.geometry || orig.geometry,
                properties: {
                    ...(orig.properties || {}),
                    ...propChanges
                },
                get: key => {
                    return feature.properties && feature.properties[key] ? feature.properties[key] : feature[key];
                }
            };
            return feature;
        };
    }
    getChildContext() {
        return {
            isModified: (id, key) => {
                return this.props.changes.hasOwnProperty(id) &&
                    this.props.changes[id].hasOwnProperty(key);
            },
            isProperty: (k) => k === "geometry" || isProperty(k, this.props.describeFeatureType),
            isValid: (val, key) => isValidValueForPropertyName(val, key, this.props.describeFeatureType)
        };
    }
    render() {
        const dragHandle = this.props.showDragHandle ? 'feature-grid-drag-handle-show' : 'feature-grid-drag-handle-hide';
        const Grid = this.props.gridComponent;
        const rows = this.props.features;

        // bind proper events and setup the colums array
        const columns = getToolColumns(this.props.tools, this.rowGetter, this.props.describeFeatureType, this.props.actionOpts)
            .concat(featureTypeToGridColumns(this.props.describeFeatureType, this.props.columnSettings, this.props.editable, {
                getEditor: ({localType=""} = {}) => editors[localType]
            }));
        // bind and get proper grid events from gridEvents object
        let {
            onRowsSelected = () => {},
            onRowsDeselected = () => {},
            onRowsToggled = () => {},
            ...gridEvents} = getGridEvents(this.props.gridEvents, this.rowGetter, this.props.describeFeatureType, this.props.actionOpts);

        // setup gridOpts setting app selection events binded
        let {rowSelection, ...gridOpts} = this.props.gridOpts;

        gridOpts = {
            ...gridOpts,
            rowSelection: rowSelection ? {
                ...rowSelection,
                onRowsSelected,
                onRowsDeselected
            } : null
        };

        // set selection by row click if checkbox are not present is enabled
        if (rowSelection) {
            gridEvents.onRowClick = (rowIdx, row) => onRowsToggled([{rowIdx, row}]);
        }
        return (<Grid
          rowRenderer={require('./renderers/RowRenderer')}
          className={dragHandle}
          enableCellSelect={this.props.editable}
          selectBy={this.props.selectBy}
          {...gridEvents}
          {...gridOpts}
          columns={columns}
          minHeight={600}
          rowGetter={this.rowGetter}
          rowsCount={rows.length}
        />);
    }
}
module.exports = FeatureGrid;
