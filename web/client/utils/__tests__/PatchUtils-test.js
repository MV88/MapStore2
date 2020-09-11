import expect from 'expect';

import { transformPath, convertToJsonPatch } from '../PatchUtils';


const cities = [
    { name: "London", "population": 8615246 },
    { name: "Rome",   "population": 2870528 }
];

describe.only('Patch Utils', () => {
    // TODO test with jiff, if i remove something then all is applied correctly
    it('transformPath', () => {
        const paths = [
            {test: ["$", "0", "name"], result: "/0/name"},
            {test: ["$", "plugins", "desktop", "0", "name"], result: "/plugins/desktop/0/name"}
        ];
        paths.forEach(({test, result}) => expect(transformPath([test])).toEqual(result));
    });
    it('transformPath with jsonPatch format for the path', () => {
        const paths = [
            {test: "/plugins/desktop/0/name", result: "/plugins/desktop/0/name"}
        ];
        paths.forEach(({test, result}) => expect(transformPath(test)).toEqual(result));
    });
    it('convertToJsonPatch with multiple results per rule', () => {
        const transformed = convertToJsonPatch(cities, [
            {op: "remove", jsonpath: "$..name", value: ""},
            {op: "add", jsonpath: "$..[?(@.name == 'Rome')].name", value: ""}
        ]);
        expect(transformed).toEqual([
            { op: 'remove', path: '/0/name' }, // London
            { op: 'remove', path: '/1/name' }, // Rome
            { op: 'add', path: '/1/name' } // Rome
        ]);
    });
    it('convertToJsonPatch with json patch paths', () => {
        const transformed = convertToJsonPatch(cities, [{op: "remove", jsonpath: "/0/name", value: ""}, {op: "add", jsonpath: "/1/name", value: ""}]);
        expect(transformed).toEqual([
            { op: 'remove', path: '/0/name' }, // London
            { op: 'add', path: '/1/name' } // Rome
        ]);
    });
    it('convertToJsonPatch with no results', () => {
        const transformed = convertToJsonPatch(cities, [{op: "remove", jsonpath: "$..undef", value: ""}]);
        expect(transformed).toEqual([]);
    });
});

