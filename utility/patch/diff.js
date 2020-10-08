const jiff = require('jiff');
const denodeify = require('denodeify');
const fs = require('fs');
const writeFile = denodeify(fs.writeFile);

const austro = require('../../web/client/test-resources/mergeConfigs/austroConfig.json');
const nostro = require('../../web/client/localConfig.json');

const patch = jiff.diff(nostro, austro);
console.log("patch", patch);
writeFile("./patchAustro.json", JSON.stringify(patch, null, 4));
