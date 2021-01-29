import jp from 'jsonpath';
import jiff from "jiff";
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import castArray from 'lodash/castArray';
import axios from 'axios';

/**
 * convert paths from jsonpath format to json patch format
 * @param {object[]} paths array of paths in jsonpath format
 */
const transformPath = (paths) => {
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
const convertToJsonPatch = (sourceJSON = {}, rawRule = {}) => {
    const {op, jsonpath, value} = rawRule;
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
    return transformedRules;
};


/**
 * this grab each file and for each one it will check if it is a patch file
 * it stores them to use when it finds a complete file to work on.
 * @param {string[] | string} files path to the patch files and full files
 *
 * @example
 * `
 * mergePatchFiles(["/patch/localConfig.patch.json", "/MapStore2/web/client/localConfig.json"])
 * mergePatchFiles(["/patch/localConfig.patch.json", "/otherPatchFolder/localConfig.patch.json", "localConfig.json"])
 * `
 */

const isFullFile = (path) => path?.indexOf("patch") === -1;

function getFirstValid([f1, ...nextFiles]) {
    return axios.get(f1).then(({data}) => data).catch(e => {
        // TODO: check not found ?
        if (nextFiles.length === 0) {
            throw e;
        }
        return getFirstValid(nextFiles);
    });
}

/**
 * apply recursively a single json path rule
 * @param {*} fullConfig main json file to perform checks
 * @param {object[]} patch array of jsonpath rules
 * @return the final json patched
 */
const checkAgainTheSameRule = (fullConfig, patch, counter = 0) => {
    let full = fullConfig;
    let c = counter;
    let rules = convertToJsonPatch(fullConfig, patch);
    if (rules.length > 0) {
        full = jiff.patch([rules[counter] ? rules[counter] : rules[0]], fullConfig);
        c += 1;
    }
    if ((rules.length - c) > 0) {
        return checkAgainTheSameRule(full, patch, c);
    }
    return full;
};


/**
 * it takes the first config file provided and it
 * @param {string[] | string} configsToFetch a list of paths where a request is performed in order to fetch a config file or patch
 */
const mergePatchFiles = (configsToFetch) => {

    const files = castArray(configsToFetch);

    const patchOnlyFiles = files.filter((file) => !isFullFile(file)); // todo filter empty or errors
    const rules = axios
        .all(patchOnlyFiles.map(patch => axios
            .get(patch)
            .then(({data}) => data)
            .catch((e) => {
                // eslint-disable-next-line
                console.error(e);
                return [];
            }))
        )
        .then((patches) => patches.flat());

    // get the first full localConfig file
    const fullOnlyFiles = files.filter((file) => isFullFile(file));
    const fullFile = getFirstValid(fullOnlyFiles);

    return rules.reduce((fullConfig, patch) => {
        return checkAgainTheSameRule(fullConfig, patch);
    }, fullFile);

};

/* TODO
- [ ] catch jsonpath before running jiff
- [ ] add tests for isFullPath
- [ ] think about a default to apply
- [ ] manage error after the merge
- [ ] filter empty or errors in patch files
- [ ] add tests for mergePatchFiles
- [ ] use default config only when the full file is not found
*/
module.exports = {
    transformPath,
    convertToJsonPatch,
    checkAgainTheSameRule,
    isFullFile,
    getFirstValid,
    mergePatchFiles
};
