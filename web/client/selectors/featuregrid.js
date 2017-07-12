const {head, get} = require('lodash');
const {layersSelector} = require('./layers');
const getLayerById = (state, id) => head(layersSelector(state).filter(l => l.id === id));
const getTitle = (layer = {}) => layer.title || layer.name;
const getSelectedId = state => get(state, "featuregrid.selectedLayer");
const getCustomAttributeSettings = (state, att) => get(state, `featuregrid.attributes[${att.name || att.attribute}]`);
const {attributesSelector} = require('./query');
const selectedFeaturesSelector = state => state && state.featuregrid && state.featuregrid.select;
const changesSelector = (state) => state && state.featuregrid && state.featuregrid.changes;
/* eslint-disable */
const toChangesMap = (changesArray) => changesArray.reduce((changes, c) => ({
    ...changes,
    [c.id]: {
        ...changes[c.id],
        ...c.updated
    }
}), {});
/* eslint-enable */
module.exports = {
  getTitleSelector: state => getTitle(
    getLayerById(
        state,
        getSelectedId(state)
    )),
    getCustomizedAttributes: state => {
        return (attributesSelector(state) || []).map(att => {
            const custom = getCustomAttributeSettings(state, att);
            if (custom) {
                return {
                    ...att,
                    ...custom
                };
            }
            return att;
        });
    },
    modeSelector: (state) => state && state.featuregrid && state.featuregrid.mode,
    selectedFeaturesSelector,
    selectedFeaturesCount: state => (selectedFeaturesSelector(state) || []).length,
    changesSelector,
    toChangesMap,
    changesMapSelector: (state) => toChangesMap(changesSelector(state)),
    hasChangesSelector: state => state && state.featuregrid && state.featuregrid.changes && state.featuregrid.changes.length > 0,
    newFeaturesSelector: state => state && state.featuregrid.newFeatures

};
