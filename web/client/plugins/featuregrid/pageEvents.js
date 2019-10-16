import { changePage, moreFeatures } from '../../actions/featuregrid';

module.exports = {
    onPageChange: (page, size) => changePage(page, size),
    moreFeatures
};
