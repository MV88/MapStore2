
const {get} = require('lodash');

export default {
    pathnameSelector: (state) => get(state, "router.location.pathname") || "/"
};
