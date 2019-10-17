var context = require.context('../..', true, /^\.*((\/components)|(\/actions)|(\/reducers))((?!__tests__).)*jsx?$/);
context.keys().forEach(context);
export default context;
