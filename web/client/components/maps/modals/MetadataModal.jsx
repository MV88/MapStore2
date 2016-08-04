/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Metadata = require('../forms/Metadata');
const Thumbnail = require('../forms/Thumbnail');
require('./css/modals.css');

const {Modal, Button, Glyphicon, Grid, Row, Col} = require('react-bootstrap');
const Message = require('../../I18N/Message');

const Dialog = require('../../../components/misc/Dialog');
const assign = require('object-assign');

const Spinner = require('react-spinkit');
const LocaleUtils = require('../../../utils/LocaleUtils');

  /**
   * A Modal window to show map metadata form
   */
const MetadataModal = React.createClass({
    propTypes: {
        // props
        id: React.PropTypes.string,
        user: React.PropTypes.object,
        authHeader: React.PropTypes.string,
        show: React.PropTypes.bool,
        options: React.PropTypes.object,
        onMetadataEdit: React.PropTypes.func,
        onCreateThumbnail: React.PropTypes.func,
        onDeleteThumbnail: React.PropTypes.func,
        onMetadataEdited: React.PropTypes.func,
        onClose: React.PropTypes.func,
        useModal: React.PropTypes.bool,
        closeGlyph: React.PropTypes.string,
        buttonSize: React.PropTypes.string,
        includeCloseButton: React.PropTypes.bool,
        map: React.PropTypes.object,
        style: React.PropTypes.object,
        fluid: React.PropTypes.bool
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            id: "MetadataModal",
            onMetadataEdit: ()=> {},
            onCreateThumbnail: ()=> {},
            onDeleteThumbnail: ()=> {},
            user: {
                name: "Guest"
            },
            onClose: () => {},
            options: {},
            useModal: true,
            closeGlyph: "",
            buttonSize: "small",
            includeCloseButton: true,
            fluid: true
        };
    },
    componentWillReceiveProps() {
        this.setState({
            loading: false
        });
    },
    setMapNameValue(newName) {
        if (this.refs.mapMetadataForm) {
            this.refs.mapMetadataForm.setMapNameValue(newName);
        }
    },
    getInitialState() {
        return {
            loading: false
        };
    },
    generateUUID() {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); // use high-precision timer if available
        }
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    getDataUri(callback) {
        let filesSelected = this.refs.thumbnail.getFiles();
        if (filesSelected.length > 0) {
            let fileToLoad = filesSelected[0];
            let fileReader = new FileReader();
            fileReader.onload = (event) => (callback(event.target.result));
            return fileReader.readAsDataURL(fileToLoad);
        }
        return callback(null);
    },
    onCreateThumbnail() {
        this.getDataUri((data) => {
            const name = this.generateUUID(); // create new unique name
            const category = "THUMBNAIL";

            if (!data) {
                // TODO here it needs to be updated the thumbnail attribute of the this.props.map.id Resource with a space and must be done only if the user doesnt provide any image
            }
            if (this.props.map.thumbnail.includes("geostore")) {
                // DELETE old thumbnail resource if no image is provided

                // TODO this doesnt work if the url istnt codified
                let start = (this.props.map.thumbnail).indexOf("data%2F") + 7;
                let end = (this.props.map.thumbnail).indexOf("%2Fraw");
                let idThumbnail = this.props.map.thumbnail.slice(start, end);

                // TODO delete should delete the old thumbnail
                this.props.onDeleteThumbnail(idThumbnail);
            }
            // POST if thumbanil is not from geostore
            if ( this.props.map && ( this.refs.thumbnail.refs && this.refs.thumbnail.refs.imgThumbnail && this.refs.thumbnail.refs.imgThumbnail.src !== this.props.map.thumbnail ) ) {
                this.props.onCreateThumbnail(name, data, category, this.props.map.id);
            }
        });
        this.props.onClose();
    },
    onMetadataEdit() {
        if (
            this.props.map &&
            (
            this.refs.mapMetadataForm.refs.mapDescription.getValue() !== this.props.map.description ||
            this.refs.mapMetadataForm.refs.mapName.getValue() !== this.props.map.name
            )) {
            this.props.onMetadataEdit(this.props.map.id, this.refs.mapMetadataForm.refs.mapName.getValue(), this.refs.mapMetadataForm.refs.mapDescription.getValue());
        }
        this.props.onClose();
    },
    renderLoading() {
        return this.state.loading ? <Spinner spinnerName="circle" key="loadingSpinner" noFadeIn/> : null;
    },
    render() {
        const footer = (<span role="footer"><div style={{"float": "left"}}>{this.renderLoading()}</div>
        <Button
            ref="metadataSaveButton"
            key="metadataSaveButton"
            bsStyle="primary"
            bsSize={this.props.buttonSize}
            onClick={() => {
                this.setState({loading: true});
                this.onCreateThumbnail();
                this.onMetadataEdit();
            }}><Message msgId="save" /></Button>
        {this.props.includeCloseButton ? <Button
            key="closeButton"
            ref="closeButton"
            bsSize={this.props.buttonSize}
            onClick={this.props.onClose}><Message msgId="close" /></Button> : <span/>}
        </span>);
        const body = (<Metadata role="body" ref="mapMetadataForm"
            onChange={() => {
                this.setState({metadataValid: this.refs.mapMetadataForm.isValid()});
            }}
            map={this.props.map}
            nameFieldText={<Message msgId="map.name" />}
            descriptionFieldText={<Message msgId="map.description" />}
            namePlaceholderText={LocaleUtils.getMessageById(this.context.messages, "map.namePlaceholder") || "Map Name"}
            descriptionPlaceholderText={LocaleUtils.getMessageById(this.context.messages, "map.descriptionPlaceholder") || "Map Description"}
            />);
        return this.props.useModal ? (
            <Modal {...this.props.options}
                show={this.props.show}
                onHide={this.props.onClose}
                id={this.props.id}>
                <Modal.Header key="mapMetadata" closeButton>
                    <Modal.Title>
                        <Message msgId="manager.editMapMetadata" />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Grid fluid={this.props.fluid}>
                        <Row>
                            <Col xs={7}>
                                <Thumbnail map={this.props.map} ref="thumbnail"/>
                            </Col>
                            <Col xs={5}>
                                {body}
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                  {footer}
                </Modal.Footer>
            </Modal>) : (
            <Dialog id="mapstore-mapmetadata-panel" style={assign({}, this.props.style, {display: this.props.show ? "block" : "none"})}>
                <span role="header"><span className="mapmetadata-panel-title"><Message msgId="manager.editMapMetadata" /></span><button onClick={this.props.onClose} className="login-panel-close close">{this.props.closeGlyph ? <Glyphicon glyph={this.props.closeGlyph}/> : <span>×</span>}</button></span>
                {body}
                {footer}
            </Dialog>
        );
    }
});

module.exports = MetadataModal;
