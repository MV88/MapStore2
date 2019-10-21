/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import ReactDOM from 'react-dom';
import { createSink } from 'recompose';
import expect from 'expect';
import dependenciesToWidget from '../dependenciesToWidget';

describe('dependenciesToWidget enhancer', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('dependency transformation', (done) => {
        const Sink = dependenciesToWidget(createSink( props => {
            expect(props).toExist();
            expect(props.dependencies.x).toBe("a");
            done();
        }));
        ReactDOM.render(<Sink dependenciesMap={{x: "b"}} dependencies={{b: "a"}}/>, document.getElementById("container"));
    });
});
