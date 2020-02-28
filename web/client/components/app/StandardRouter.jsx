/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
import React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Debug from '../development/Debug';
import { Route } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import history from '../../stores/History';
import Localized from '../I18N/Localized';
import assign from 'object-assign';
import ThemeComp from '../theme/Theme';

const Theme = connect((state) => ({
    theme: state.theme && state.theme.selectedTheme && state.theme.selectedTheme.id
}), {}, (stateProps, dispatchProps, ownProps) => {
    return assign({}, stateProps, dispatchProps, ownProps);
})(ThemeComp);

class StandardRouter extends React.Component {
    static propTypes = {
        plugins: PropTypes.object,
        locale: PropTypes.object,
        pages: PropTypes.array,
        className: PropTypes.string,
        themeCfg: PropTypes.object,
        version: PropTypes.string,
        loadAfterTheme: PropTypes.bool
    };

    static defaultProps = {
        plugins: {},
        locale: {messages: {}, current: 'en-US'},
        pages: [],
        className: "fill",
        themeCfg: {
            path: 'dist/themes'
        },
        loadAfterTheme: false
    };
    state = {
        themeLoaded: false
    }
    renderPages = () => {
        return this.props.pages.map((page, i) => {
            const pageConfig = page.pageConfig || {};
            const Component = connect(() => ({
                plugins: this.props.plugins,
                ...pageConfig
            }))(page.component);
            return <Route key={(page.name || page.path) + i} exact path={page.path} component={Component}/>;
        });
    };

    renderAfterTheme() {
        return (
            <div className={this.props.className}>
                <Theme {...this.props.themeCfg} version={this.props.version} onLoad={this.themeLoaded}>
                    {this.state.themeLoaded ? (<Localized messages={this.props.locale.messages} locale={this.props.locale.current} loadingError={this.props.locale.localeError}>
                        <ConnectedRouter history={history}>
                            <div>
                                {this.renderPages()}
                            </div>
                        </ConnectedRouter>
                    </Localized>) :
                        (<span><div className="_ms2_init_spinner _ms2_init_center"><div></div></div>
                            <div className="_ms2_init_text _ms2_init_center">Loading MapStore</div></span>)}
                </Theme>
                <Debug/>
            </div>
        );
    }
    renderWithTheme() {
        return (
            <div className={this.props.className}>
                <Theme {...this.props.themeCfg} version={this.props.version}/>
                <Localized messages={this.props.locale.messages} locale={this.props.locale.current} loadingError={this.props.locale.localeError}>
                    <ConnectedRouter history={history}>
                        <div>
                            {this.renderPages()}
                        </div>
                    </ConnectedRouter>
                </Localized>
                <Debug/>
            </div>);
    }
    render() {
        return this.props.loadAfterTheme ? this.renderAfterTheme() : this.renderWithTheme();
    }
    themeLoaded = () => {
        this.setState({
            themeLoaded: true
        });
    }
}

export default StandardRouter;
