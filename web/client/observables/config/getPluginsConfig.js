import axios from '../../libs/ajax';
import ConfigUtils from '../../utils/ConfigUtils';
import {isObject, isEmpty} from 'lodash';
import jiff from "jiff";

/**
 * Returns a Promise that profides the configuration for plugins
 * @param {string} pluginsConfigURL the URL of the configuration.
 */
export default (pluginsConfigURL) => axios.get(pluginsConfigURL || ConfigUtils.getConfigProp('contextPluginsConfiguration') || 'pluginsConfig.json')
    .then(result => result.data);


export const getPluginsConfigWithPath = (pluginsConfigURL) => axios.all([
    axios.get(pluginsConfigURL || ConfigUtils.getConfigProp('contextPluginsConfiguration') || 'pluginsConfig.json')
        .then(result => result.data).catch((e) => {
            // eslint-disable-next-line
            console.log(e);
            return {};
        }),
    axios.get('patch/pluginsConfig.patch.json')
        .then(result => isObject(result.data) ? result.data : {}).catch((e) => {
            // eslint-disable-next-line
            console.log(e);
            return {};
        })
]).then(([original, patch]) => {
    let merged = original;
    if (!isEmpty(patch)) {
        merged = jiff.patch(patch, original);
    }
    return {...merged};
});
