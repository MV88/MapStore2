import PropTypes from 'prop-types';

/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { Checkbox, FormGroup, Button, Glyphicon } from 'react-bootstrap';
import { Controlled as Codemirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import assign from 'object-assign';

class PluginConfigurator extends React.Component {
    static propTypes = {
        pluginName: PropTypes.string,
        pluginsCfg: PropTypes.array,
        onToggle: PropTypes.func,
        onApplyCfg: PropTypes.func,
        pluginConfig: PropTypes.string,
        pluginImpl: PropTypes.object
    };

    state = {
        configVisible: false,
        code: "{}"
    };

    UNSAFE_componentWillMount() {
        this.setState({
            code: this.props.pluginConfig
        });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.pluginConfig !== this.props.pluginConfig) {
            this.setState({
                code: newProps.pluginConfig
            });
        }
    }

    getPropValue = (type) => {
        if (type === PropTypes.string || type === PropTypes.string.isRequired) {
            return '';
        }
        if (type === PropTypes.number || type === PropTypes.number.isRequired) {
            return 0;
        }
        if (type === PropTypes.bool || type === PropTypes.bool.isRequired) {
            return false;
        }
        if (type === PropTypes.object || type === PropTypes.object.isRequired) {
            return {};
        }
        if (type === PropTypes.array || type === PropTypes.array.isRequired) {
            return [];
        }
        return null;
    };

    renderCfg = () => {
        return this.state.configVisible ? [
            <label key="config-label">Enter a JSON object to configure plugin properties</label>,
            <Codemirror key={"code-mirror" + this.props.pluginName} value={this.state.code} onBeforeChange={this.updateCode} options={{
                mode: {name: "javascript", json: true},
                lineNumbers: true
            }}/>,
            <Button key="apply-cfg" bsStyle="primary" onClick={this.applyCfg}>Apply</Button>,
            <Button key="help-cfg" bsStyle="primary" onClick={this.showProps}><Glyphicon glyph="question-sign"/></Button>
        ] : null;
    };

    render() {
        return (<li style={{border: "solid 1px lightgrey", borderRadius: "3px", paddingLeft: "10px", paddingRight: "10px", marginBottom: "3px", marginRight: "10px"}} key={this.props.pluginName + "enable"}>
            <Button bsSize="small" bsStyle="primary" onClick={this.toggleCfg}><Glyphicon glyph={this.state.configVisible ? "minus" : "plus"}/></Button>
            <FormGroup>
                <Checkbox className="pluginEnable" name="toolscontainer"
                    disabled={this.props.pluginName === 'Map'}
                    checked={this.props.pluginsCfg.indexOf(this.props.pluginName) !== -1}
                    onChange={this.props.onToggle}>
                    {this.props.pluginName}
                </Checkbox>
            </FormGroup>
            {this.renderCfg()}
        </li>);
    }

    showProps = () => {
        if (this.props.pluginImpl) {
            const plugin = this.props.pluginImpl;
            const pluginProps = plugin.WrappedComponent && plugin.WrappedComponent.propTypes || plugin.propTypes;

            const propsValues = plugin.WrappedComponent && plugin.WrappedComponent.getDefaultProps && plugin.WrappedComponent.getDefaultProps() ||
                plugin.getDefaultProps && plugin.getDefaultProps() || {};

            const props = Object.keys(pluginProps || {}).reduce((previous, current) => {
                return assign(previous, {[current]: this.getPropValue(pluginProps[current])}, propsValues);
            }, {});
            this.setState({
                code: JSON.stringify(props, null, 4)
            });
        }
    };

    updateCode = (editor, data, newCode) => {
        this.setState({
            code: newCode
        });
    };

    toggleCfg = () => {
        this.setState({configVisible: !this.state.configVisible});
    };

    applyCfg = () => {
        this.props.onApplyCfg(this.state.code);
    };
}

export default PluginConfigurator;
