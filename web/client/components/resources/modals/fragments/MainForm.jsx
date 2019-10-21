/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Message from '../../../I18N/Message';
import { Row, Col } from 'react-bootstrap';
import Metadata from '../../forms/Metadata';
import Thumbnail from '../../forms/Thumbnail';
import uuid from 'uuid/v1';

export default class MainForm extends React.Component {
    render() {
        const {
            resource,
            linkedResources = {},
            onError = () => { },
            onUpdate = () => { },
            onUpdateLinkedResource = () => { }
        } = this.props;
        return (<Row>
            <Col xs={12}>
                <Thumbnail
                    resource={resource}
                    thumbnail={
                        (linkedResources && linkedResources.thumbnail && linkedResources.thumbnail.data)
                        || resource && resource.attributes && resource.attributes.thumbnail
                    }
                    onError={onError}
                    onRemove={() => onUpdateLinkedResource("thumbnail", "NODATA", "THUMBNAIL", {
                        tail: `/raw?decode=datauri&v=${uuid()}`
                    })}
                    onUpdate={(data) => onUpdateLinkedResource("thumbnail", data, "THUMBNAIL", {
                        tail: `/raw?decode=datauri&v=${uuid()}`
                    })} />
            </Col>
            <Col xs={12}>
                <Metadata role="body" ref="mapMetadataForm"
                    onChange={onUpdate}
                    resource={resource}
                    nameFieldText={<Message msgId="saveDialog.name" />}
                    descriptionFieldText={<Message msgId="saveDialog.description" />}
                    namePlaceholderText={"saveDialog.namePlaceholder"}
                    descriptionPlaceholderText={"saveDialog.descriptionPlaceholder"}
                />
            </Col>
        </Row>);
    }
}


