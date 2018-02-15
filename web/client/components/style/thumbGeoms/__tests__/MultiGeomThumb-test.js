const expect = require('expect');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-dom/test-utils');
const MultiGeomThumb = require('../MultiGeomThumb');
const {DEFAULT_ANNOTATIONS_STYLES} = require('../../../../utils/AnnotationsUtils');

describe("Test the MultiGeomThumb component", () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('create component with default', () => {
        const cmp = ReactDOM.render(<MultiGeomThumb />, document.getElementById("container"));
        expect(cmp).toExist();
    });
    it('create component with only MultiPolygon', () => {
        const style = DEFAULT_ANNOTATIONS_STYLES;
        const cmp = ReactDOM.render(<MultiGeomThumb styleMultiGeom={style} geometry={{geometries: [{type: "MultiPolygon"}]}}/>, document.getElementById("container"));
        expect(cmp).toExist();
        const rect = TestUtils.findRenderedDOMComponentWithTag(cmp, 'rect');
        const svg = TestUtils.findRenderedDOMComponentWithTag(cmp, 'svg');
        expect(rect).toExist();
        const path = TestUtils.scryRenderedDOMComponentsWithTag(cmp, 'path');
        expect(path.length).toBe(0);
        expect(rect.attributes.style.value).toBe("fill: rgb(255, 255, 255); stroke-width: 3; stroke: rgb(255, 204, 51); fill-opacity: 0.2; opacity: 1;");
        expect(rect.attributes.width.value).toBe("50");
        expect(rect.attributes.height.value).toBe("50");
        expect(rect.attributes.x.value).toBe("20");
        expect(rect.attributes.y.value).toBe("15");
        expect(svg.attributes.xmlns.value).toBe("http://www.w3.org/2000/svg");
        expect(svg.attributes.viewBox.value).toBe("0 0 100 100");

    });
    it('create component with only MultiPolygon LineString', () => {
        const style = DEFAULT_ANNOTATIONS_STYLES;
        const cmp = ReactDOM.render(<MultiGeomThumb styleMultiGeom={style} geometry={{geometries: [{type: "MultiPolygon"}, {type: "LineString"}]}}/>, document.getElementById("container"));
        expect(cmp).toExist();
        const rect = TestUtils.findRenderedDOMComponentWithTag(cmp, 'rect');

        const svg = TestUtils.findRenderedDOMComponentWithTag(cmp, 'svg');
        expect(rect).toExist();
        expect(rect.attributes.style.value).toBe("fill: rgb(255, 255, 255); stroke-width: 3; stroke: rgb(255, 204, 51); fill-opacity: 0.2; opacity: 1;");
        expect(rect.attributes.width.value).toBe("50");
        expect(rect.attributes.height.value).toBe("50");
        expect(rect.attributes.x.value).toBe("40");
        expect(rect.attributes.y.value).toBe("15");
        expect(svg.attributes.xmlns.value).toBe("http://www.w3.org/2000/svg");
        expect(svg.attributes.viewBox.value).toBe("0 0 100 100");

    });


});
