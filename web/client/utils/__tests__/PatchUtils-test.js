import expect from 'expect';
import find from 'lodash/find';

import {
    checkAgainTheSameRule,
    transformPath,
    convertToJsonPatch,
    isFullFile,
    getFirstValid,
    mergePatchFiles
} from '../PatchUtils';
import MockAdapter from "axios-mock-adapter";
import axios from 'axios';


const plugins = [
    {
        "name": "Home"
    },
    {
        "name": "Home",
        "CFG": {}
    },
    {
        "name": "FeatureEditor"
    },
    {
        "name": "WFSDownload"
    }
];

const localConfig = {
    plugins: {desktop: plugins}
};

const patches = [
    {"op": "remove", "jsonpath": "$.plugins.desktop..[?(@.name == 'Home')]"},
    {"op": "remove", "jsonpath": "$.plugins.desktop..[?(@.name == 'FeatureEditor')]"}
];
let mockAxios;
describe.only('Patch Utils', () => {

    // TODO test with jiff, if i remove something then all is applied correctly
    describe('isFullFile', () => {
        it('isFullFile', () => {
            expect(isFullFile("full.json")).toBe(true);
            expect(isFullFile("full.patch.json")).toBe(false);
        });
    });
    describe('transformPath', () => {
        it('with jsonpath format', () => {
            const paths = [
                {test: ["$", "0", "name"], result: "/0/name"},
                {test: ["$", "plugins", "desktop", "0", "name"], result: "/plugins/desktop/0/name"}
            ];
            paths.forEach(({test, result}) => expect(transformPath([test])).toEqual(result));
        });
        it('with jsonPatch format', () => {
            const paths = [
                {test: "/plugins/desktop/0/name", result: "/plugins/desktop/0/name"}
            ];
            paths.forEach(({test, result}) => expect(transformPath(test)).toEqual(result));
        });
    });
    describe('convertToJsonPatch', () => {
        it('with multiple results per rule', () => {
            const transformed = convertToJsonPatch(localConfig, patches[0]);
            expect(transformed).toEqual([
                { op: 'remove', path: '/plugins/desktop/0' },
                { op: 'remove', path: '/plugins/desktop/1' }
            ]);
        });
        it('with json patch paths', () => {
            const transformed = convertToJsonPatch(localConfig, patches[1]);
            expect(transformed).toEqual([
                { op: 'remove', path: '/plugins/desktop/2' }
            ]);
        });
        it('with no results', () => {
            const transformed = convertToJsonPatch(localConfig, {op: "remove", jsonpath: "$..undef", value: ""});
            expect(transformed).toEqual([]);
        });
    });
    describe("checkAgainTheSameRule", () => {

        it("applying two rules generated from 1 jsonpath rule ", () => {
            const full = require("../../../client/test-resources/mergeConfigs/fullConfig.json");
            const multipleRule = {"op": "remove", "jsonpath": "$.plugins.desktop..[?(@.name == 'Home')]"};
            const config = checkAgainTheSameRule(full, multipleRule);
            expect(config.plugins.desktop).toEqual([
                {"name": "FeatureEditor"},
                {"name": "WFSDownload" }]
            );
        });
        it("applying 1 rule generated from 1 jsonpath rule ", () => {
            const full = require("../../../client/test-resources/mergeConfigs/fullConfig.json");
            const multipleRule = {"op": "remove", "jsonpath": "$.plugins.desktop..[?(@.name == 'FeatureEditor')]"};
            const config = checkAgainTheSameRule(full, multipleRule);
            expect(config.plugins.desktop).toEqual([
                {"name": "Home"},
                {"name": "Home", "CFG": {}},
                {"name": "WFSDownload" }]
            );
        });
        it("should not return undefined if passed a wrong rule ", () => {
            const fully = require("../../../client/test-resources/mergeConfigs/fullConfig.json");
            const wrongRule = {"op": "remove", "jsonpath": "$.plugins.wrong"};
            const config = checkAgainTheSameRule(fully, wrongRule);
            expect(config.plugins.desktop).toEqual([
                {
                    "name": "Home"
                },
                {
                    "name": "Home",
                    "CFG": {}
                },
                {
                    "name": "FeatureEditor"
                },
                {
                    "name": "WFSDownload"
                }
            ]
            );
        });
    });
    describe('testing merge utils', () => {
        beforeEach(() => {
            mockAxios = new MockAdapter(axios);
        });
        afterEach(() => {
            mockAxios.restore();
        });
        describe('getFirstValid', () => {
            it('get the first valid which is the first', async() => {
                const full = require("../../../client/test-resources/mergeConfigs/fullConfig.json");
                const full2 = require("../../../client/test-resources/mergeConfigs/fullConfig2.json");
                mockAxios.onGet(new RegExp(/fullConfig/ig)).reply(200, full);
                mockAxios.onGet(new RegExp(/fullConfig2/ig)).reply(200, full2);
                const config = await getFirstValid(["fullConfig", "fullConfig2"]);
                expect(config).toBeTruthy();
                expect(config.plugins.desktop.length).toBe(4);
            });
            it('get the first valid which is the last', async() => {
                const full = require("../../../client/test-resources/mergeConfigs/fullConfig.json");
                const full2 = require("../../../client/test-resources/mergeConfigs/fullConfig2.json");
                mockAxios.onGet(new RegExp(/fullConfig2/ig)).reply(200, full2);
                mockAxios.onGet(new RegExp(/fullConfig/ig)).reply(200, full);
                const config = await getFirstValid(["fullConfig2", "fullConfig"]);
                expect(config).toBeTruthy();
                expect(config.plugins.desktop.length).toBe(3);
            });
            it('no FullConfig provided', async() => {
                mockAxios.onGet(new RegExp(/fullConfig2/ig)).reply(400);
                mockAxios.onGet(new RegExp(/fullConfig/ig)).reply(400);
                try {
                    const config = await getFirstValid(["fullConfig2", "fullConfig"]);
                    expect(config).toBeTruthy();
                    expect(config.plugins.desktop.length).toBe(3);
                } catch (e) {
                    expect(e).toBeTruthy();
                }
            });
        });
        describe("mergePatchFiles", () => {
            it('remove two adjacent plugins', async() => {
                const full = require("../../../client/test-resources/mergeConfigs/fullConfig.json");
                const multipleRule = require("../../../client/test-resources/mergeConfigs/multipleRule.patch.json");
                mockAxios.onGet(new RegExp(/fullConfig/ig)).reply(200, full);
                mockAxios.onGet(new RegExp(/multipleRule/ig)).reply(200, multipleRule);
                try {
                    const config = await mergePatchFiles([
                        "fullConfig.json",
                        "multipleRule.patch.json"
                    ]);
                    expect(config.plugins.desktop.length).toEqual(2);
                    expect(config.plugins.desktop).toEqual([
                        {
                            "name": "FeatureEditor"
                        },
                        {
                            "name": "WFSDownload"
                        }
                    ]);
                } catch (e) {
                    expect(e).toBe(false);
                }
            });
            it('remove three adjacent plugins, the first two in a patch file, the other in the next one', async() => {
                const full = require("../../../client/test-resources/mergeConfigs/fullConfig.json");
                const multipleRule = require("../../../client/test-resources/mergeConfigs/multipleRule.patch.json");
                const multipleRule2 = require("../../../client/test-resources/mergeConfigs/multipleRule2.patch.json");
                mockAxios.onGet(new RegExp(/fullConfig/ig)).reply(200, full);
                mockAxios.onGet(new RegExp(/multipleRule2/ig)).reply(200, multipleRule2);
                mockAxios.onGet(new RegExp(/multipleRule/ig)).reply(200, multipleRule);
                try {
                    const config = await mergePatchFiles([
                        "fullConfig.json",
                        "multipleRule.patch.json",
                        "multipleRule2.patch.json"
                    ]);
                    expect(config.plugins.desktop.length).toEqual(1);
                    expect(config.plugins.desktop).toEqual([
                        {
                            "name": "WFSDownload"
                        }
                    ]);
                } catch (e) {
                    expect(e).toBe(false);
                }
            });
            it('remove three adjacent plugins, the first one in a patch file, the others two in the next one', async() => {
                const full = require("../../../client/test-resources/mergeConfigs/fullConfig.json");
                const multipleRule = require("../../../client/test-resources/mergeConfigs/multipleRule.patch.json");
                const multipleRule2 = require("../../../client/test-resources/mergeConfigs/multipleRule2.patch.json");
                mockAxios.onGet(new RegExp(/fullConfig/ig)).reply(200, full);
                mockAxios.onGet(new RegExp(/multipleRule2/ig)).reply(200, multipleRule2);
                mockAxios.onGet(new RegExp(/multipleRule/ig)).reply(200, multipleRule);
                try {
                    const config = await mergePatchFiles([
                        "fullConfig.json",
                        "multipleRule2.patch.json",
                        "multipleRule.patch.json"
                    ]);
                    expect(config.plugins.desktop.length).toEqual(1);
                    expect(config.plugins.desktop).toEqual([
                        {
                            "name": "WFSDownload"
                        }
                    ]);
                } catch (e) {
                    expect(e).toBe(false);
                }
            });
            it('remove three adjacent plugins, add a new one, replace its cfg ', async() => {
                const full = require("../../../client/test-resources/mergeConfigs/fullConfig.json");
                const multipleRule = require("../../../client/test-resources/mergeConfigs/multipleRule.patch.json");
                const multipleRule2 = require("../../../client/test-resources/mergeConfigs/multipleRule2.patch.json");
                const multipleRule3 = require("../../../client/test-resources/mergeConfigs/multipleRule3.patch.json");
                mockAxios.onGet(new RegExp(/fullConfig/ig)).reply(200, full);
                mockAxios.onGet(new RegExp(/multipleRule3/ig)).reply(200, multipleRule3);
                mockAxios.onGet(new RegExp(/multipleRule2/ig)).reply(200, multipleRule2);
                mockAxios.onGet(new RegExp(/multipleRule/ig)).reply(200, multipleRule);
                try {
                    const config = await mergePatchFiles([
                        "fullConfig.json",
                        "multipleRule.patch.json",
                        "multipleRule2.patch.json",
                        "multipleRule3.patch.json"
                    ]);
                    expect(config.plugins.desktop.length).toEqual(2);
                    expect(config.plugins.desktop).toEqual([
                        {
                            "name": "WFSDownload"
                        },
                        {
                            "name": "NewPlugin",
                            "cfg": {
                                "otherParam": false
                            }
                        }
                    ]);
                } catch (e) {
                    expect(e).toBe(false);
                }
            });
            it('add a plugin in between two specific plugins', async() => {
                const full = require("../../../client/test-resources/mergeConfigs/fullConfig.json");
                const multipleRule4 = require("../../../client/test-resources/mergeConfigs/multipleRule4.patch.json");
                mockAxios.onGet(new RegExp(/fullConfig/ig)).reply(200, full);
                mockAxios.onGet(new RegExp(/multipleRule4/ig)).reply(200, multipleRule4);
                try {
                    const config = await mergePatchFiles([
                        "fullConfig.json",
                        "multipleRule4.patch.json"
                    ]);
                    expect(config.plugins.desktop.length).toEqual(5);
                    console.log(config.plugins.desktop);
                    expect(config.plugins.desktop).toEqual([
                        {
                            "name": "Home"
                        },
                        {
                            "name": "Home",
                            "CFG": {}
                        },
                        {
                            "name": "NewPlugin",
                            "cfg": {
                                "someParam": true
                            }
                        },
                        {
                            "name": "FeatureEditor"
                        },
                        {
                            "name": "WFSDownload"
                        }
                    ]);
                } catch (e) {
                    expect(e).toBe(false);
                }
            });
            it('add a plugin in between two specific plugins and removing one after it', async() => {
                const full = require("../../../client/test-resources/mergeConfigs/fullConfig.json");
                const multipleRule5 = require("../../../client/test-resources/mergeConfigs/multipleRule5.patch.json");
                mockAxios.onGet(new RegExp(/fullConfig/ig)).reply(200, full);
                mockAxios.onGet(new RegExp(/multipleRule5/ig)).reply(200, multipleRule5);
                try {
                    const config = await mergePatchFiles([
                        "fullConfig.json",
                        "multipleRule5.patch.json"
                    ]);
                    expect(config.plugins.desktop.length).toEqual(4);
                    console.log(config.plugins.desktop);
                    expect(config.plugins.desktop).toEqual([
                        {
                            "name": "Home"
                        },
                        {
                            "name": "Home",
                            "CFG": {}
                        },
                        {
                            "name": "NewPlugin",
                            "cfg": {
                                "someParam": true
                            }
                        },
                        {
                            "name": "WFSDownload"
                        }
                    ]);
                } catch (e) {
                    expect(e).toBe(false);
                }
            });
            it('testing multiple jsonpatch rules based on two different jsonpath rules', async() => {
                const plugins03 = require("../../../client/test-resources/mergeConfigs/03_austro_pluginsMultiple.patch.json");
                const full = require("../../../client/test-resources/mergeConfigs/04_full_localConfig.json");
                mockAxios.onGet(new RegExp(/04_full_localConfig/ig)).reply(200, full);
                mockAxios.onGet(new RegExp(/03_austro_pluginsMultiple/ig)).reply(200, plugins03);
                try {
                    const config = await mergePatchFiles([
                        "04_full_localConfig.json",
                        "03_austro_pluginsMultiple.patch.json"
                    ]);

                    expect(config).toBeTruthy();
                    expect(find(config.plugins.mobile, ({name}) => name === "Search")?.cfg?.searchOptions?.services?.[0]?.options?.replacedEverywhereSecondRule).toBeTruthy();

                    expect(find(config.plugins.desktop, ({name}) => name === "Search")?.cfg?.searchOptions?.services?.[0]?.options?.replacedEverywhereSecondRule).toBeTruthy();

                    expect(find(config.plugins.embedded, ({name}) => name === "Search")?.cfg?.searchOptions?.services?.[0]?.options?.replacedEverywhereSecondRule).toBeTruthy();

                } catch (e) {
                    expect(e).toBe(false);
                }
            });
            it('Complete test with a real scenario', async() => {
                // const resultExpected = require("../../../client/test-resources/mergeConfigs/05_result_austroConfig.json");
                const rootVars = require("../../../client/test-resources/mergeConfigs/01_austro_rootVars.patch.json");
                const stateVars = require("../../../client/test-resources/mergeConfigs/02_austro_stateVars.patch.json");
                const pluginsTest = require("../../../client/test-resources/mergeConfigs/05_austro_plugins.patch.json");
                const full = require("../../../client/test-resources/mergeConfigs/04_full_localConfig.json");
                mockAxios.onGet(new RegExp(/04_full_localConfig/ig)).reply(200, full);
                mockAxios.onGet(new RegExp(/01_austro_rootVars/ig)).reply(200, rootVars);
                mockAxios.onGet(new RegExp(/02_austro_stateVars/ig)).reply(200, stateVars);
                mockAxios.onGet(new RegExp(/05_austro_plugins/ig)).reply(200, pluginsTest);
                try {
                    const config = await mergePatchFiles([
                        "04_full_localConfig.json",
                        "01_austro_rootVars.patch.json",
                        "02_austro_stateVars.patch.json",
                        "05_austro_plugins.patch.json"
                    ]);
                    expect(config).toBeTruthy();
                    expect(config.mailingList).toBeFalsy();
                    expect(config.proxyUrl.useCORS.length).toBe(4);
                    expect(find(config.plugins.desktop, ({name}) => name === "LayerInfo")).toBeTruthy();
                    expect(find(config.plugins.desktop, ({name}) => name === "IdentifySettings")).toBeTruthy();
                } catch (e) {
                    expect(e).toBe(false);
                }
            });
        });

    });
});

