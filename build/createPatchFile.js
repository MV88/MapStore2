const fs = require('fs');
const jiff = require("jiff");
const denodeify = require('denodeify');
const writeFile = denodeify(fs.writeFile);
const readdir = denodeify(fs.readdir);

const projectFolder = './';
const patchFolder = `${projectFolder}/patch`;
const suffix = "patch";
const filename = "localConfig";
readdir(projectFolder)
    .then( () => {
        const ms2NewJson = require(`../web/client/${filename}.json`);
        const newJson = {} || require(`../../${filename}.json`);
        let patch = jiff.diff(ms2NewJson, newJson);
        return writeFile(`${patchFolder}/${filename}.${suffix}.json`, JSON.stringify(patch, null, 4));
    })
    .catch((err) => {
        process.stderr.write(err + '\n');
    });
