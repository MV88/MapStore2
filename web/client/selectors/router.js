
import { get } from 'lodash';

module.exports = {
    pathnameSelector: (state) => get(state, "router.location.pathname") || "/"
};
