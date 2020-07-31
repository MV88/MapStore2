const fs = require('fs');
const jiff = require("jiff");
const denodeify = require('denodeify');
const writeFile = denodeify(fs.writeFile);
const readdir = denodeify(fs.readdir);

const projectFolder = './';
const patchFolder = `${projectFolder}/patch`;
const suffix = "Generated";
const filename = "localConfig";

readdir(projectFolder)
    .then( () => {
        const ms2NewJson = require(`../web/client/${filename}.json`);
        const newPatchJson = {} || require(`../../patch/${filename}.patch.json`);
        let mergedNew = jiff.patch(newPatchJson, ms2NewJson);
        return writeFile(`${patchFolder}/${filename}.${suffix}.json`, JSON.stringify(mergedNew, null, 4));
    })
    .catch((err) => {
        process.stderr.write(err + '\n');
    });
