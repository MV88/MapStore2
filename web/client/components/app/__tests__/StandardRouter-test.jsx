/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import expect from 'expect';

import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import StandardRouter from '../StandardRouter';
import ConfigUtils from '../../../utils/ConfigUtils';

class mycomponent extends React.Component {
    static propTypes = {
        plugins: PropTypes.object
    };

    static defaultProps = {
        plugins: {}
    };

    renderPlugins = () => {
        return Object.keys(this.props.plugins).map((plugin) => <div className={plugin}/>);
    };

    render() {
        return (<div className="mycomponent">
            {this.renderPlugins()}
        </div>);
    }
}

describe('StandardRouter', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        ConfigUtils.setLocalConfigurationFile('base/web/client/test-resources/localConfig.json');
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        ConfigUtils.setLocalConfigurationFile('localConfig.json');
        setTimeout(done);
    });

    it('creates a default router app', () => {
        const store = {
            dispatch: () => {},
            subscribe: () => {
                return () => {};
            },
            unsubscribe: () => {},
            getState: () => ({})
        };
        const app = ReactDOM.render(<Provider store={store}><StandardRouter/></Provider>, document.getElementById("container"));
        expect(app).toExist();
    });

    it('creates a default router app with pages', () => {
        const store = {
            dispatch: () => {},
            subscribe: () => {
                return () => { };
            },
            getState: () => ({})
        };
        const pages = [{
            name: 'mypage',
            path: '/',
            component: mycomponent
        }];
        const app = ReactDOM.render(<Provider store={store}><StandardRouter pages={pages}/></Provider>, document.getElementById("container"));
        expect(app).toExist();
        const dom = ReactDOM.findDOMNode(app);

        expect(dom.getElementsByClassName('mycomponent').length).toBe(1);
    });

    it('creates a default router app with pages and plugins', () => {
        const plugins = {
            MyPlugin: {}
        };

        const store = {
            dispatch: () => {},
            subscribe: () => {
                return () => { };
            },
            getState: () => ({})
        };
        const pages = [{
            name: 'mypage',
            path: '/',
            component: mycomponent
        }];
        const app = ReactDOM.render(<Provider store={store}><StandardRouter plugins={plugins} pages={pages}/></Provider>, document.getElementById("container"));
        expect(app).toExist();

        const dom = ReactDOM.findDOMNode(app);

        expect(dom.getElementsByClassName('MyPlugin').length).toBe(1);
    });
});
