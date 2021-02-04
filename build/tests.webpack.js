var context = require.context('../web/client/epics', true, /(search-test\.jsx?)|(-test-chrome\.jsx?)$/);
context.keys().forEach(context);
module.exports = context;
