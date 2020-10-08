// const jiff = require("jiff");
const jp = require( 'jsonpath');
const jiff = require("jiff");
const isArray = require( 'lodash/isArray');
const isString = require( 'lodash/isString');
const castArray = require( 'lodash/castArray');
const axios = require( 'axios');

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
const convertToJsonPatch = (sourceJSON = {}, rawRules = [{op: "remove", jsonpath: "$..name", value: ""}, {op: "add", jsonpath: "$..name", value: ""}]) => {
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

const isFullFile = (path) => path?.indexOf("patch.json") === -1;

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
 * it takes the first config file provided and it
 * @param {string[] | string} configsToFetch a list of paths where a request is performed in order to fetch a config file or patch
 */
const mergePatchFiles = async(configsToFetch) => {

    const files = castArray(configsToFetch);

    // --------------------------------------------------
    const patchOnlyFiles = files.filter((file) => !isFullFile(file)); // todo filter empty or errors
    const patchFiles = await axios
        .all(patchOnlyFiles.map(patch => axios.get(patch)
            .then(({data}) => data)
            .catch((e) => {
                // eslint-disable-next-line
                console.log(e);
                return null;
            }))
        )
        .then((patches) => patches);

    //
    const fullOnlyFiles = files.filter((file) => isFullFile(file));

    // --------------------------------------------------
    // get the first full localConfig file

    const fullFile = await getFirstValid(fullOnlyFiles);


    // --------------------------------------------------
    return patchFiles.reduce((fullconfig, patch) => {
        const jsonPatchFormat = convertToJsonPatch(fullconfig, patch); // convert to json patch format
        return jiff.patch(jsonPatchFormat, fullconfig);
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
    isFullFile,
    mergePatchFiles
};
