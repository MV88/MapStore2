/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';
import React from 'react';
import {DragDropContext as dragDropContext} from 'react-dnd';
import testBackend from 'react-dnd-test-backend';
import ReactDOM from 'react-dom';

import MapOptionsComp from '../MapOptions';

const MapOptions = dragDropContext(testBackend)(MapOptionsComp);

describe('MapOptions component', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('MapOptions rendering with defaults', () => {
        ReactDOM.render(<MapOptions />, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container.querySelector('.mapstore-step-title')).toBeTruthy();
        // renders the TOC
        expect(container.querySelector('.ms-layers-tree')).toBeFalsy();
        expect(container.querySelector('.empty-state-container')).toBeTruthy();
        // not the Editor
        expect(container.querySelector('.ms-row-tab')).toBeFalsy();
    });
    it('MapOptions rendering layers', () => {
        ReactDOM.render(<MapOptions
            map={{ groups: [{ id: 'GGG' }], layers: [{ id: "LAYER", group: "GGG", name: "LAYER", options: {} }] }}
            nodes={[{ id: 'GGG', nodes: [{ id: "LAYER", group: "GGG", name: "LAYER", options: {} }] }]}
            layers={[{ id: "LAYER", group: "GGG", name: "LAYER", options: {} }]}
        />, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container.querySelector('.mapstore-step-title')).toBeTruthy();
        // renders the TOC
        expect(container.querySelector('.ms-layers-tree')).toBeTruthy();
        expect(container.querySelector('.empty-state-container')).toBeFalsy();
        // not the Editor
        expect(container.querySelector('.ms-row-tab')).toBeFalsy();
    });
    it('MapOptions rendering node editor', () => {
        ReactDOM.render(<MapOptions
            map={{ groups: [{ id: 'GGG' }], layers: [{ id: "LAYER", group: "GGG", name: "LAYER", options: {} }] }}
            nodes={[{ id: 'GGG', nodes: [{ id: "LAYER", group: "GGG", name: "LAYER", options: {}}]}]}
            layers={[{ id: "LAYER", group: "GGG", name: "LAYER", options: {} }]}
            editNode={"LAYER"} />, document.getElementById("container"));
        const container = document.getElementById('container');
        // renders the editor
        expect(container.querySelector('.ms-row-tab')).toBeTruthy();
        // not the TOC
        expect(container.querySelector('.ms-layers-tree')).toBeFalsy();
    });
});
