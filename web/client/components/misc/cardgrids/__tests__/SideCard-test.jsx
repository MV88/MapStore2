/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const ReactDOM = require('react-dom');

const expect = require('expect');
const SideCard = require('../SideCard');
describe('SideCard component', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('SideCard rendering with defaults', () => {
        ReactDOM.render(<SideCard />, document.getElementById("container"));
        const container = document.getElementById('container');
        const el = container.querySelector('.mapstore-side-card');
        expect(el).toExist();
        expect(container.querySelector('.selected')).toNotExist();
    });
    it('SideCard selected', () => {
        ReactDOM.render(<SideCard selected/>, document.getElementById("container"));
        const container = document.getElementById('container');
        const el = container.querySelector('.selected');
        expect(el).toExist();
    });

    it('SideCard show/hide preview node', () => {
        ReactDOM.render(<SideCard selected/>, document.getElementById("container"));
        const container = document.getElementById('container');
        let preview = container.querySelector('.mapstore-side-preview');
        expect(preview).toNotExist();

        ReactDOM.render(<SideCard preview={'icon'} selected/>, document.getElementById("container"));

        preview = container.querySelector('.mapstore-side-preview');
        expect(preview).toExist();
        preview.innerHTML = 'icon';
    });


    it('SideCard show/hide caption node', () => {
        ReactDOM.render(<SideCard selected/>, document.getElementById("container"));
        const container = document.getElementById('container');
        let caption = container.querySelector('.mapstore-side-caption');
        expect(caption).toNotExist();

        ReactDOM.render(<SideCard caption={'caption'} selected/>, document.getElementById("container"));

        caption = container.querySelector('.mapstore-side-card-caption');
        expect(caption).toExist();
        caption.innerHTML = 'caption';
    });

    it('SideCard show/hide caption node', () => {
        ReactDOM.render(<SideCard selected/>, document.getElementById("container"));
        const container = document.getElementById('container');
        let caption = container.querySelector('.mapstore-side-caption');
        expect(caption).toNotExist();

        ReactDOM.render(<SideCard caption={'caption'} selected/>, document.getElementById("container"));

        caption = container.querySelector('.mapstore-side-card-caption');
        expect(caption).toExist();
        caption.innerHTML = 'caption';
    });

    it('SideCard show/hide body node', () => {
        ReactDOM.render(<SideCard selected/>, document.getElementById("container"));
        const container = document.getElementById('container');
        let body = container.querySelector('.ms-body');
        expect(body).toNotExist();

        ReactDOM.render(<SideCard body={'body'} selected/>, document.getElementById("container"));

        body = container.querySelector('.ms-body');
        expect(body).toExist();
        body.innerHTML = 'body';
    });
});
