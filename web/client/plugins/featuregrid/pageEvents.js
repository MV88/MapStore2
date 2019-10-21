const {changePage, moreFeatures} = require('../../actions/featuregrid');

export default {
    onPageChange: (page, size) => changePage(page, size),
    moreFeatures
};
