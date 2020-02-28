/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import ReactDOM from 'react-dom';
import { ConfirmDelete, ConfirmFeatureClose, ConfirmClear } from '../dialog';
import expect from 'expect';

describe('FeatureGrid confirm dialogs', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('render ConfirmDelete', () => {
        ReactDOM.render(<ConfirmDelete/>, document.getElementById("container"));
        const el = document.getElementById("confirm-dialog");
        expect(el).toExist();
    });
    it('render ConfirmFeatureClose', () => {
        ReactDOM.render(<ConfirmFeatureClose/>, document.getElementById("container"));
        const el = document.getElementById("confirm-dialog");
        expect(el).toExist();
    });
    it('render ConfirmClear', () => {
        ReactDOM.render(<ConfirmClear/>, document.getElementById("container"));
        const el = document.getElementById("confirm-dialog");
        expect(el).toExist();
    });

});
