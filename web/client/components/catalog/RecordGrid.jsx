/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import RecordItem from './RecordItem';

class RecordGrid extends React.Component {
    static propTypes = {
        recordItem: PropTypes.element,
        catalogURL: PropTypes.string,
        catalogType: PropTypes.string,
        onZoomToExtent: PropTypes.func,
        zoomToLayer: PropTypes.bool,
        onLayerAdd: PropTypes.func,
        onError: PropTypes.func,
        records: PropTypes.array,
        authkeyParamNames: PropTypes.array,
        style: PropTypes.object,
        showGetCapLinks: PropTypes.bool,
        addAuthentication: PropTypes.bool,
        column: PropTypes.object,
        currentLocale: PropTypes.string,
        hideThumbnail: PropTypes.bool,
        hideIdentifier: PropTypes.bool,
        hideExpand: PropTypes.bool,
        showTemplate: PropTypes.bool,
        layerBaseConfig: PropTypes.object
    };

    static defaultProps = {
        column: {xs: 12},
        currentLocale: 'en-US',
        onLayerAdd: () => {},
        onError: () => {},
        records: [],
        zoomToLayer: true,
        layerBaseConfig: {}
    };

    renderRecordItem = (record) => {
        let Item = this.props.recordItem || RecordItem;
        return (
            <Col {...this.props.column} key={record.identifier}>
                <Item
                    onLayerAdd={this.props.onLayerAdd}
                    onZoomToExtent={this.props.onZoomToExtent}
                    zoomToLayer={this.props.zoomToLayer}
                    hideThumbnail={this.props.hideThumbnail}
                    hideIdentifier={this.props.hideIdentifier}
                    hideExpand={this.props.hideExpand}
                    onError={this.props.onError}
                    catalogURL={this.props.catalogURL}
                    catalogType={this.props.catalogType}
                    showTemplate={this.props.showTemplate}
                    record={record}
                    authkeyParamNames={this.props.authkeyParamNames}
                    style={{height: "215px", maxHeight: "215px"}}
                    showGetCapLinks={this.props.showGetCapLinks}
                    addAuthentication={this.props.addAuthentication}
                    currentLocale={this.props.currentLocale}
                    layerBaseConfig={this.props.layerBaseConfig}
                />
            </Col>
        );
    };

    render() {
        if (this.props.records) {
            let mapsList = this.props.records instanceof Array ? this.props.records : [this.props.records];
            return (
                <Grid className="record-grid" fluid style={this.props.style}>
                    <Row>
                        {mapsList.map(this.renderRecordItem)}
                    </Row>
                </Grid>
            );
        }

        return null;
    }
}

export default RecordGrid;
