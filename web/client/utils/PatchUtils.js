// const jiff = require("jiff");
import jp from 'jsonpath';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';


/**
 * convert paths from jsonpath format to json patch format
 * @param {object[]} paths array of paths in jsonpath format
 */
export const transformPath = (paths) => {
    if (isArray(paths)) {
        return paths.map(([, ...other]) => ["", ...other].join("/"));
    }
    return isString(paths) ? paths : "";
};

/**
 * converts mixed rules with json path format in fully compatible json path rules
 * @param {object} sourceJSON usually the main json to perform research
 * @param {object[]} rawRules series of object defined with json patch format with jsonpath format for the path
 *
 * @example rule for removing all ZoomIn plugins
 * {op: "remove", jsonpath: "$.plugins..[?(@.name == 'ZoomIn')]"}
 *
 *
 * @example rule for changing config to all ZoomIn plugins
 * {op: "replace", jsonpath: "$.plugins..[?(@.name == 'ZoomIn')].cfg.maxZoom, value: 3}
 */
export const convertToJsonPatch = (sourceJSON = {}, rawRules = [{op: "remove", jsonpath: "$..name", value: ""}, {op: "add", jsonpath: "$..name", value: ""}]) => {
    const patchRules = rawRules.reduce((p, {op, jsonpath, value}) => {
        let transformedPaths;
        try {
            transformedPaths = transformPath(jp.paths(sourceJSON, jsonpath));
        } catch (e) {
            // in this case the jsonpath lib failed because the path was not a valid jsonpath one
            transformedPaths = [jsonpath];
        }
        let transformedRules = transformedPaths.map((path) => {
            let transformedRule = { op, path };
            if (value) {
                transformedRule.value = value;
            }
            return transformedRule;
        });
        return p.concat(transformedRules);
    }, []);
    return patchRules;
};
