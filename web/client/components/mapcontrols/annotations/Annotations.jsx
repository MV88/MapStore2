/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const ConfirmDialog = require('../../misc/ConfirmDialog');
const Message = require('../../I18N/Message');
const LocaleUtils = require('../../../utils/LocaleUtils');
const LineThumb = require('../../../components/style/thumbGeoms/LineThumb.jsx');
const MultiGeomThumb = require('../../../components/style/thumbGeoms/MultiGeomThumb.jsx');
const PolygonThumb = require('../../../components/style/thumbGeoms/PolygonThumb.jsx');
const {head} = require('lodash');
const assign = require('object-assign');
const Filter = require('../../misc/Filter');
const uuidv1 = require('uuid/v1');

const {Grid, Col, Row, Glyphicon, Button} = require('react-bootstrap');
const BorderLayout = require('../../layout/BorderLayout');
const Toolbar = require('../../misc/toolbar/Toolbar');
const SideGrid = require('../../misc/cardgrids/SideGrid');


const defaultConfig = require('./AnnotationsConfig');

/**
 * Annotations panel component.
 * It can be in different modes:
 *  - list: when showing the current list of annotations on the map
 *  - detail: when showing a detail of a specific annotation
 *  - editing: when editing an annotation
 * When in list mode, the list of current map annotations is shown, with:
 *  - summary card for each annotation, with full detail show on click
 *  - new annotation Button
 *  - filtering widget
 * When in detail mode the configured editor is shown on the selected annotation, in viewer mode.
 * When in editing mode the configured editor is shown on the selected annotation, in editing mode.
 *
 * It also handles removal confirmation modals
 * @memberof components.mapControls.annotations
 * @class
 * @prop {boolean} closing user asked for closing panel when editing
 * @prop {object} editing annotation object currently under editing (null if we are not in editing mode)
 * @prop {object} removing object to remove, it is also a flag that means we are currently asking for removing an annotation / geometry. Toggles visibility of the confirm dialog
 * @prop {string} mode current mode of operation (list, editing, detail)
 * @prop {object} editor editor component, used in detail and editing modes
 * @prop {object[]} annotations list of annotations objects to list
 * @prop {string} current id of the annotation currently shown in the editor (when not in list mode)
 * @prop {object} config configuration object, where overridable stuff is stored (fields config for annotations, marker library, etc.) {@link #components.mapControls.annotations.AnnotationsConfig}
 * @prop {string} filter current filter entered by the user
 * @prop {function} onCancelRemove triggered when the user cancels removal
 * @prop {function} onConfirmRemove triggered when the user confirms removal
 * @prop {function} onCancelClose triggered when the user cancels closing
 * @prop {function} onConfirmClose triggered when the user confirms closing
 * @prop {function} onAdd triggered when the user clicks on the new annotation button
 * @prop {function} onHighlight triggered when the mouse hovers an annotation card
 * @prop {function} onCleanHighlight triggered when the mouse is out of any annotation card
 * @prop {function} onDetail triggered when the user clicks on an annotation card
 * @prop {function} onFilter triggered when the user enters some text in the filtering widget
 * @prop {function} classNameSelector optional selector to assign custom a CSS class to annotations, based on
 * the annotation's attributes.
 */
class Annotations extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        styling: PropTypes.bool,
        toggleControl: PropTypes.func,

        closing: PropTypes.bool,
        editing: PropTypes.object,
        removing: PropTypes.object,
        onCancelRemove: PropTypes.func,
        onConfirmRemove: PropTypes.func,
        onCancelClose: PropTypes.func,
        onConfirmClose: PropTypes.func,
        onAdd: PropTypes.func,
        onHighlight: PropTypes.func,
        onCleanHighlight: PropTypes.func,
        onDetail: PropTypes.func,
        mode: PropTypes.string,
        editor: PropTypes.func,
        annotations: PropTypes.array,
        current: PropTypes.string,
        config: PropTypes.object,
        filter: PropTypes.string,
        onFilter: PropTypes.func,
        classNameSelector: PropTypes.func,
        width: PropTypes.number
    };

    static contextTypes = {
        messages: PropTypes.object
    };

    static defaultProps = {
        mode: 'list',
        config: defaultConfig,
        classNameSelector: () => '',
        toggleControl: () => {}
    };

    getConfig = () => {
        return assign({}, defaultConfig, this.props.config);
    };

    renderFieldValue = (field, annotation) => {
        const fieldValue = annotation.properties[field.name] || '';
        switch (field.type) {
            case 'html':
                return <span dangerouslySetInnerHTML={{__html: fieldValue} }/>;
            default:
                return fieldValue;
        }
    };

    renderField = (field, annotation) => {
        return (<div className={"mapstore-annotations-panel-card-" + field.name}>
            {this.renderFieldValue(field, annotation)}
        </div>);
    };

    renderThumbnail = ({style, featureType}) => {
        if (featureType !== "MultiPoint" && featureType === "LineString" || featureType === "MultiLineString" ) {
            return (<span className={"mapstore-annotations-panel-card"}>
            <LineThumb styleRect={style}/>
        </span>);
        }
        if (featureType === "GeometryCollection") {
            return (<span className={"mapstore-annotations-panel-card"}>
            <MultiGeomThumb styleRect={style}/>
        </span>);
        }
        if (featureType !== "MultiPoint" && featureType === "Polygon" || featureType === "MultiPolygon" ) {
            return (<span className={"mapstore-annotations-panel-card"}>
            <PolygonThumb styleRect={style}/>
        </span>);
        }

        const marker = this.getConfig().getMarkerFromStyle(style);
        return (
            <span className={"mapstore-annotations-panel-card"}>
                <div className={"mapstore-annotations-panel-card-thumbnail-" + marker.name} style={{...marker.thumbnailStyle, margin: 'auto', textAlign: 'center', color: '#ffffff', marginLeft: 7}}>
                    <span className={"mapstore-annotations-panel-card-thumbnail " + this.getConfig().getGlyphClassName(style)} style={{marginTop: 0, marginLeft: -7}}/>
                </div>
            </span>);
    };

    renderItems = (annotation) => {
        const cardActions = {
            onMouseEnter: () => {this.props.onHighlight(annotation.properties.id); },
            onMouseLeave: this.props.onCleanHighlight,
            onClick: () => this.props.onDetail(annotation.properties.id)
        };
        return {
            ...this.getConfig().fields.reduce( (p, c)=> {
                return assign({}, p, {[c.name]: this.renderField(c, annotation)});
            }, {}),
            preview: this.renderThumbnail({style: annotation.style, featureType: annotation.geometry.type }),
            ...cardActions
        };
    };

    renderCards = () => {
        if (this.props.mode === 'list') {
            return (
            <SideGrid items={this.props.annotations.filter(this.applyFilter).map(a => this.renderItems(a))}/>
            );
        }
        const annotation = this.props.annotations && head(this.props.annotations.filter(a => a.properties.id === this.props.current));
        const Editor = this.props.editor;
        if (this.props.mode === 'detail') {
            return <Editor feature={annotation} showBack id={this.props.current} config={this.props.config} width={this.props.width} {...annotation.properties}/>;
        }
        // mode = editing
        return this.props.editing && <Editor feature={annotation} id={this.props.editing.properties && this.props.editing.properties.id || uuidv1()} width={this.props.width} config={this.props.config} {...this.props.editing.properties}/>;
    };

    renderHeader() {
        return (
            <Grid fluid className="ms-header" style={this.props.styling || this.props.mode !== "list" ? { width: '100%', boxShadow: 'none'} : { width: '100%' }}>
                <Row>
                    <Col xs={2}>
                        <Button className="square-button no-events">
                            <Glyphicon glyph="comment"/>
                        </Button>
                    </Col>
                    <Col xs={8}>
                        <h4><Message msgId="annotations.title"/></h4>
                    </Col>
                    <Col xs={2}>
                        <Button className="square-button no-border" onClick={this.props.toggleControl} >
                            <Glyphicon glyph="1-close"/>
                        </Button>
                    </Col>
                </Row>
                {this.props.mode === "list" && <span><Row>
                    <Col xs={12} className="text-center">
                        <Toolbar
                            btnDefaultProps={{ className: 'square-button-md', bsStyle: 'primary'}}
                            buttons={[
                                {
                                    glyph: 'plus',
                                    tooltip: <Message msgId="annotations.add"/>,
                                    visible: this.props.mode === "list",
                                    onClick: () => { this.props.onAdd(this.props.config.multiGeometry ? 'MultiPoint' : 'Point'); }
                                }
                            ]}/>
                    </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Filter
                        filterPlaceholder={LocaleUtils.getMessageById(this.context.messages, "annotations.filter")}
                        filterText={this.props.filter}
                        onFilter={this.props.onFilter} />
                </Col>
            </Row></span>}
            {this.props.styling && <Row className="ms-style-header">
                <Col xs={12}>
                    tabs
                </Col>
            </Row>}
        </Grid>
        );
    }

    render() {
        let body = null;
        if (this.props.closing) {
            body = (<ConfirmDialog
                    show
                    modal
                    onClose={this.props.onCancelClose}
                    onConfirm={this.props.onConfirmClose}
                    confirmButtonBSStyle="default"
                    closeGlyph="1-close"
                    confirmButtonContent={<Message msgId="annotations.confirm" />}
                    closeText={<Message msgId="annotations.cancel" />}>
                    <Message msgId="annotations.undo"/>
                </ConfirmDialog>);
        } else if (this.props.removing) {
            body = (<ConfirmDialog
                show
                modal
                onClose={this.props.onCancelRemove}
                onConfirm={() => this.props.onConfirmRemove(this.props.removing)}
                confirmButtonBSStyle="default"
                closeGlyph="1-close"
                confirmButtonContent={<Message msgId="annotations.confirm" />}
                closeText={<Message msgId="annotations.cancel" />}>
                <Message msgId={this.props.mode === 'editing' ? "annotations.removegeometry" : "annotations.removeannotation"}/>
                </ConfirmDialog>);
        } else {
            body = (<span> {this.renderCards()} </span>);
        }
        return (<BorderLayout id={this.props.id} header={this.renderHeader()}>
            {body}
        </BorderLayout>);

    }

    applyFilter = (annotation) => {
        return !this.props.filter || this.getConfig().fields.reduce((previous, field) => {
            return (annotation.properties[field.name] || '').toUpperCase().indexOf(this.props.filter.toUpperCase()) !== -1 || previous;
        }, false);
    };
}

module.exports = Annotations;
