/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import ReactDOM from 'react-dom';
import expect from 'expect';
import errorChartState from '../errorChartState';

describe('widgets errorChartState enhancer', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('errorChartState rendering with defaults', () => {
        const Dummy = errorChartState(() => <div id="dummy"></div>);
        ReactDOM.render(<Dummy data={[]}/>, document.getElementById("container"));
        expect(document.getElementById("dummy")).toExist();
    });
    it('errorChartState rendering with error', () => {
        const Dummy = errorChartState(() => <div id="dummy"></div>);
        ReactDOM.render(<Dummy error={new Error()}/>, document.getElementById("container"));
        expect(document.getElementById("dummy")).toNotExist();
    });
});
