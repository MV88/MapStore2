var context = require.context('./web/client/components/mapcontrols/measure', true, /(-test\.jsx?)|(-test-chrome\.jsx?)$/);
context.keys().forEach(context);
module.exports = context;
