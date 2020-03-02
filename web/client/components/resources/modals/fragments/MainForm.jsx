/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import FileDrop from '../../forms/FileDrop';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import uuid from 'uuid/v1';

import Message from '../../../I18N/Message';
import Metadata from '../../forms/Metadata';
import Thumbnail from '../../forms/Thumbnail';

class MainForm extends React.Component {
    static propTypes = {
        acceptedDropFileName: PropTypes.any, // don't know the type here
        fileDropLabel: PropTypes.any,
        fileDropStatus: PropTypes.any,
        fileDropErrorMessage: PropTypes.any,
        fileDropClearMessage: PropTypes.any,
        resource: PropTypes.object,
        linkedResources: PropTypes.object,
        enableFileDrop: PropTypes.bool,
        onError: PropTypes.func,
        onFileDropClear: PropTypes.func,
        onFileDrop: PropTypes.func,
        nameFieldFilter: PropTypes.func,
        onUpdate: PropTypes.func,
        onUpdateLinkedResource: PropTypes.func
    }
    render() {
        const {
            resource,
            linkedResources = {},
            enableFileDrop = false,
            acceptedDropFileName,
            fileDropLabel,
            fileDropStatus,
            fileDropErrorMessage,
            fileDropClearMessage,
            onFileDrop = () => { },
            onFileDropClear = () => { },
            onError = () => { },
            onUpdate = () => { },
            nameFieldFilter = () => { },
            onUpdateLinkedResource = () => { }
        } = this.props;
        return (<Row>
            {enableFileDrop && <Col xs={12}>
                <FileDrop
                    acceptedFileName={acceptedDropFileName}
                    label={fileDropLabel}
                    status={fileDropStatus}
                    errorMessage={fileDropErrorMessage}
                    clearMessage={fileDropClearMessage}
                    onDrop={onFileDrop}
                    onClear={onFileDropClear}
                    onError={onError}/>
            </Col>}
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
                    nameFieldFilter={nameFieldFilter}
                    createdAtFieldText={<Message msgId="saveDialog.createdAt" />}
                    modifiedAtFieldText={<Message msgId="saveDialog.modifiedAt" />}
                    namePlaceholderText={"saveDialog.namePlaceholder"}
                    descriptionPlaceholderText={"saveDialog.descriptionPlaceholder"}
                />
            </Col>
        </Row>);
    }
}

export default MainForm;
