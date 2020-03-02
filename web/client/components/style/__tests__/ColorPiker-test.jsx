import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import ColorPicker from '../ColorPicker';

describe("Test the ColorPicker style component", () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('creates component with defaults', () => {
        const cmp = ReactDOM.render(<ColorPicker line/>, document.getElementById("container"));
        expect(cmp).toExist();
    });

    it('creates component loading', () => {
        const cmp = ReactDOM.render(<ColorPicker line={false} disabled/>, document.getElementById("container"));
        expect(cmp).toExist();
    });

});
