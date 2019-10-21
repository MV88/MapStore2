
import { get } from 'lodash';

export default {
    pathnameSelector: (state) => get(state, "router.location.pathname") || "/"
};
