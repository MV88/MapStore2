/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {FormControl: BFormControl, FormGroup, ControlLabel} = require('react-bootstrap');
const FormControl = require('../../misc/enhancers/localizedProps')('placeholder')(BFormControl);

/**
 * A DropDown menu for user details:
 */
class Metadata extends React.Component {
    static propTypes = {
        resource: PropTypes.object,
        // CALLBACKS
        onChange: PropTypes.func,

        // I18N
        nameFieldText: PropTypes.node,
        descriptionFieldText: PropTypes.node,
        namePlaceholderText: PropTypes.string,
        descriptionPlaceholderText: PropTypes.string,
        createdAtFieldText: PropTypes.string,
        modifiedAtFieldText: PropTypes.string
    };

    static contextTypes = {
        intl: PropTypes.object
    }

    static defaultProps = {
        // CALLBACKS
        onChange: () => {},
        resource: {},
        // I18N
        nameFieldText: "Name",
        descriptionFieldText: "Description",
        namePlaceholderText: "Map Name",
        descriptionPlaceholderText: "Map Description"
    };

    renderDate = (date) => {
        return date && this.context.intl && `${this.context.intl.formatDate(date)} ${this.context.intl.formatTime(date)}` || '';
    }

    render() {
        return (<form ref="metadataForm" onSubmit={this.handleSubmit}>
            <FormGroup>
                <ControlLabel>{this.props.nameFieldText}</ControlLabel>
                <FormControl
                    key="mapName"
                    type="text"
                    onChange={this.changeName}
                    disabled={this.props.resource.saving}
                    placeholder={this.props.namePlaceholderText}
                    defaultValue={this.props.resource ? this.props.resource.name : ""}
                    value={this.props.resource && this.props.resource.metadata && this.props.resource.metadata.name || ""}/>
            </FormGroup>
            <FormGroup>
                <ControlLabel>{this.props.descriptionFieldText}</ControlLabel>
                <FormControl
                    key="mapDescription"
                    type="text"
                    onChange={this.changeDescription}
                    disabled={this.props.resource.saving}
                    placeholder={this.props.descriptionPlaceholderText}
                    defaultValue={this.props.resource ? this.props.resource.description : ""}
                    value={this.props.resource && this.props.resource.metadata && this.props.resource.metadata.description || ""}/>
            </FormGroup>
            <FormGroup>
                <ControlLabel>{this.props.createdAtFieldText}</ControlLabel>
                <ControlLabel>{this.props.resource && this.renderDate(this.props.resource.createdAt) || ""}</ControlLabel>
            </FormGroup>
            {this.props.resource && this.props.resource.modifiedAt && <FormGroup>
                <ControlLabel>{this.props.modifiedAtFieldText}</ControlLabel>
                <ControlLabel>{this.props.resource && this.renderDate(this.props.resource.modifiedAt) || ""}</ControlLabel>
            </FormGroup>}
        </form>);
    }

    changeName = (e) => {
        this.props.onChange('metadata.name', e.target.value);
    };

    changeDescription = (e) => {
        this.props.onChange('metadata.description', e.target.value);
    };
}


module.exports = Metadata;
