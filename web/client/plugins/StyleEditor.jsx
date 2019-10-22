/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isArray, isString } from 'lodash';
import assign from 'object-assign';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { branch, compose, toClass } from 'recompose';
import { createSelector } from 'reselect';

import { updateSettingsParams } from '../actions/layers';
import { initStyleService } from '../actions/styleeditor';
import HTML from '../components/I18N/HTML';
import BorderLayout from '../components/layout/BorderLayout';
import Loader from '../components/misc/Loader';
import emptyState from '../components/misc/enhancers/emptyState';
import loadingState from '../components/misc/enhancers/loadingState';
import epics from '../epics/styleeditor';
import styleeditor from '../reducers/styleeditor';
import { userRoleSelector } from '../selectors/security';
import {
    canEditStyleSelector,
    errorStyleSelector,
    getUpdatedLayer,
    loadingStyleSelector,
    statusStyleSelector,
    styleServiceSelector,
} from '../selectors/styleeditor';
import { isSameOrigin } from '../utils/StyleEditorUtils';
import { StyleCodeEditor, StyleSelector, StyleToolbar } from './styleeditor/index';

class StyleEditorPanel extends React.Component {
    static propTypes = {
        layer: PropTypes.object,
        header: PropTypes.node,
        isEditing: PropTypes.bool,
        showToolbar: PropTypes.node.bool,
        onInit: PropTypes.func,
        styleService: PropTypes.object,
        userRole: PropTypes.string,
        editingAllowedRoles: PropTypes.array,
        enableSetDefaultStyle: PropTypes.bool,
        canEdit: PropTypes.bool
    };

    static defaultProps = {
        layer: {},
        onInit: () => {},
        editingAllowedRoles: [
            'ADMIN'
        ]
    };

    UNSAFE_componentWillMount() {
        const canEdit = !this.props.editingAllowedRoles || (isArray(this.props.editingAllowedRoles) && isString(this.props.userRole)
            && this.props.editingAllowedRoles.indexOf(this.props.userRole) !== -1);
        this.props.onInit(this.props.styleService, canEdit && isSameOrigin(this.props.layer, this.props.styleService));
    }

    render() {
        return (
            <BorderLayout
                className="ms-style-editor-container"
                header={
                    this.props.showToolbar ? <div className="ms-style-editor-container-header">
                        {this.props.header}
                        <div className="text-center">
                            <StyleToolbar
                                enableSetDefaultStyle={this.props.enableSetDefaultStyle}/>
                        </div>
                    </div> : null
                }
                footer={<div style={{ height: 25 }} />}>
                {this.props.isEditing
                    ? <StyleCodeEditor />
                    : <StyleSelector
                        showDefaultStyleIcon={this.props.canEdit && this.props.enableSetDefaultStyle}/>}
            </BorderLayout>
        );
    }
}
/**
 * StyleEditor plugin.
 * - Select styles from available styles of the layer
 * - Create a new style from a list of template
 * - Remove a style
 * - Edit css style with preview
 *
 * Note: current implementation is available only in TOCItemsSettings
 * @prop {object} cfg.styleService GeoServer service in use, when undefined Style Editor creates style service based on layer options
 * @prop {string} cfg.styleService.baseUrl base url of service eg: '/geoserver/'
 * @prop {array} cfg.styleService.availableUrls a list of urls that can access directly to the style service
 * @prop {array} cfg.styleService.formats supported formats, could be one of [ 'sld' ] or [ 'sld', 'css' ]
 * @prop {array} cfg.editingAllowedRoles all roles with edit permission eg: [ 'ADMIN' ], if null all roles have edit permission
 * @prop {array} cfg.enableSetDefaultStyle enable set default style functionality
 * @memberof plugins
 * @class StyleEditor
 */
const StyleEditorPlugin = compose(
    // Plugin needs to be a class
    // in this case 'branch' return always a functional component and PluginUtils expects a class
    toClass,
    // No rendering if not active
    // eg: now only TOCItemsSettings can active following plugin
    branch(
        ({ active } = {}) => !active,
        () => () => null
    ),
    // end
    connect(
        createSelector(
            [
                statusStyleSelector,
                loadingStyleSelector,
                getUpdatedLayer,
                errorStyleSelector,
                userRoleSelector,
                canEditStyleSelector,
                styleServiceSelector
            ],
            (status, loading, layer, error, userRole, canEdit, styleService) => ({
                isEditing: status === 'edit',
                loading,
                layer,
                error: !!(error && error.availableStyles),
                userRole,
                canEdit,
                styleService
            })
        ),
        {
            onInit: initStyleService,
            onUpdateParams: updateSettingsParams
        },
        (stateProps, dispatchProps, ownProps) => ({
            ...ownProps,
            ...stateProps,
            ...dispatchProps,
            styleService: ownProps.styleService
                ? { ...ownProps.styleService, isStatic: true }
                : { ...stateProps.styleService }
        })
    ),
    emptyState(
        ({ error }) => error,
        {
            glyph: 'exclamation-mark',
            title: <HTML msgId="styleeditor.missingAvailableStyles"/>,
            description: <HTML msgId="styleeditor.missingAvailableStylesMessage"/>,
            style: {
                display: 'flex',
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            },
            mainViewStyle: {
                margin: 'auto',
                width: 300
            }
        }
    ),
    loadingState(
        ({loading}) => loading === 'global',
        {
            size: 150,
            style: {
                margin: 'auto'
            }
        },
        props => <div style={{position: 'relative', height: '100%', display: 'flex'}}><Loader {...props}/></div>
    )
)(StyleEditorPanel);

export default {
    StyleEditorPlugin: assign(StyleEditorPlugin, {
        TOC: {
            priority: 1,
            container: 'TOCItemSettings',
            ToolbarComponent: StyleToolbar
        }
    }),
    reducers: {
        styleeditor
    },
    epics
};
