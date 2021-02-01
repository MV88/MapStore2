/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

import WidgetsView from '../WidgetsView';

const dummyWidget = {
    title: "TEST",
    id: "TEST",
    layer: {
        name: "test",
        url: 'base/web/client/test-resources/widgetbuilder/aggregate',
        wpsUrl: 'base/web/client/test-resources/widgetbuilder/aggregate',
        search: { url: 'base/web/client/test-resources/widgetbuilder/aggregate' }
    },
    options: {
        aggregateFunction: "Count",
        aggregationAttribute: "test",
        groupByAttributes: "test"
    }
};
describe('WidgetsView component', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('WidgetsView rendering with defaults', () => {
        ReactDOM.render(<WidgetsView />, document.getElementById("container"));
        const container = document.getElementById('container');
        const el = container.querySelector('.widget-container');
        expect(el).toExist();
    });
    it('Test WidgetsView with widgets', () => {
        ReactDOM.render(<WidgetsView widgets={[dummyWidget]}/>, document.getElementById("container"));
        const container = document.getElementById('container');
        const el = container.querySelector('.mapstore-widget-card');
        expect(el).toExist();
    });
    it('handler editWidget', () => {
        const actions = {
            editWidget: () => {}
        };
        const spyEditWidget = expect.spyOn(actions, 'editWidget');
        const cmp = ReactDOM.render(<WidgetsView widgets={[dummyWidget]} editWidget={actions.editWidget} />, document.getElementById("container"));
        expect(cmp).toExist();
        const container = document.getElementById('container');
        ReactTestUtils.Simulate.click(container.querySelector('.glyphicon-pencil')); // <-- trigger event callback
        expect(spyEditWidget).toHaveBeenCalled();
    });
    it('Test widget with and without resource in mobile', () => {
        const actions = {
            editWidget: () => {}
        };
        const isMobile = [true, false];
        [{canEdit: true}, null].map((resource, id)=>{
            const props = {
                canEdit: isMobile[id] ? !isMobile[id] : resource && !!resource.canEdit
            };
            const cmp = ReactDOM.render(<WidgetsView widgets={[dummyWidget]} editWidget={actions.editWidget} {...props} />, document.getElementById("container"));
            expect(cmp).toExist();
            const container = document.getElementById('container');
            expect(container.querySelector('.glyphicon-pencil')).toNotExist();
        });
    });
    it('Test widget with resource in desktop', () => {
        const actions = {
            editWidget: () => {}
        };
        const resource = {
            canEdit: true
        };
        const isMobile = false;
        const props = {
            canEdit: isMobile ? !isMobile : resource && !!resource.canEdit
        };
        const spyEditWidget = expect.spyOn(actions, 'editWidget');
        const cmp = ReactDOM.render(<WidgetsView widgets={[dummyWidget]} editWidget={actions.editWidget} {...props} />, document.getElementById("container"));
        expect(cmp).toExist();
        const container = document.getElementById('container');
        expect(container.querySelector('.glyphicon-pencil')).toExist();
        ReactTestUtils.Simulate.click(container.querySelector('.glyphicon-pencil'));
        expect(spyEditWidget).toHaveBeenCalled();
    });
    it('handler deleteWidget', () => {
        const actions = {
            deleteWidget: () => { }
        };
        const spyDeleteWidget = expect.spyOn(actions, 'deleteWidget');
        const cmp = ReactDOM.render(<WidgetsView widgets={[dummyWidget]} deleteWidget={actions.deleteWidget} />, document.getElementById("container"));
        expect(cmp).toExist();
        const container = document.getElementById('container');
        ReactTestUtils.Simulate.click(container.querySelector('.glyphicon-trash')); // <-- trigger event callback
        expect(spyDeleteWidget).toNotHaveBeenCalled(); // callback should have been called only after confirm dialog
        expect(document.querySelector('.modal-dialog')).toExist(); // confirm dialog opened. NOTE: rendered in the document, not in the container
        ReactTestUtils.Simulate.click(document.querySelector('.modal-footer button'));
        expect(spyDeleteWidget).toHaveBeenCalled();
    });
    it('layouts', () => {
        ReactDOM.render(<WidgetsView layouts={{ md: [{ i: dummyWidget.id, w: 1, h: 1, x: 1, y: 1 }]}} widgets={[dummyWidget]} />, document.getElementById("container"));
        const container = document.getElementById('container');
        const el = container.querySelector('.react-grid-item');
        expect(el).toExist();
    });
    it('tests correct width of widgets', () => {
        ReactDOM.render(<WidgetsView
            useDefaultWidthProvider
            isResizable
            verticalCompact={false}
            isDraggable
            rowHeight={186}
            layouts={{ md: [{
                i: dummyWidget.id,
                h: 1,
                isBounded: undefined,
                isDraggable: true,
                isResizable: true,
                maxH: undefined,
                maxW: undefined,
                minH: undefined,
                minW: undefined,
                moved: false,
                resizeHandles: undefined,
                "static": false,
                w: 1,
                x: 0,
                y: 0
            }]}}
            width={undefined}
            breakpoints={{md: 480, xxs: 0}}
            cols={{md: 6, xxs: 1}}
            style={{
                bottom: 65,
                height: 784,
                left: "500px",
                marginTop: 52,
                position: "absolute",
                width: "calc(100% - 570px)",
                zIndex: 50
            }}
            widgets={[dummyWidget]}
        />, document.getElementById("container"));

        const container = document.getElementById('container');
        const el = container.querySelector('.mapstore-widget-card');
        expect(el.clientWidth).toBe(211); // should be 213 in real browser
    });
    it('statics widgets', () => {
        ReactDOM.render(<WidgetsView layouts={{ md: [{ i: dummyWidget.id, w: 1, h: 1, x: 1, y: 1 }] }} widgets={[{...dummyWidget, dataGrid: {"static": true, w: 1, h: 1, x: 1, y: 1 }}]} />, document.getElementById("container"));
        const container = document.getElementById('container');
        const el = container.querySelector('.react-grid-item.static');
        expect(el).toExist();
    });
});
