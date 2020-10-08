const { mergePatchFiles } = require('../../web/client/utils/PatchUtils');

try {
    const result = mergePatchFiles(["wrongPath", "/web/client/localConfig", "localConfig"]);
    console.log("result", result);
} catch(e) {
    console.log("error");
    console.error(e);
}
