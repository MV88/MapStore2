/**
 * Copyright 2015-2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const expect = require('expect');

const React = require('react');
const ReactDOM = require('react-dom');
const decimalToAeronautical = require('../decimalToAeronautical');
const {compose, withState, createSink} = require('recompose');

// const TestUtils = require('react-dom/test-utils');

describe("test the Annotations enahncers", () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('decimalToAeronautical conversion', (done) => {
        const Sink = decimalToAeronautical(createSink( props => {
            expect(props).toExist();
            expect(props.degrees).toBe(1);
            expect(props.minutes).toBe(30);
            expect(props.seconds).toBe(0);
            done();
        }));
        ReactDOM.render((<Sink
            value = {1.50}
            coordinate="lon"
            />), document.getElementById("container"));
    });
    it('convert from/to preserve precision', (done) => {
        const enhancer = compose(
            withState('value', 'onChange', 1.5),
            decimalToAeronautical
        );
        const Sink = enhancer(createSink(props => {
            expect(props).toExist();
            if (props.seconds === 0) {
                props.onChange({ "degrees": 47, "minutes": 45, "seconds": 1, "direction": "N" });
            }
            if (props.seconds === 1) {
                done();
            }
        }));
        ReactDOM.render((<Sink
            coordinate="lon"
        />), document.getElementById("container"));
    });

});
