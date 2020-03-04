/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import {find} from 'lodash';
import assign from 'object-assign';
import {Editors as defaultEditors} from '../../components/data/featuregrid/editors/customEditors';

let Editors = assign({}, {...defaultEditors});

const isPresent = (editorName) => {
    return Object.keys(Editors).indexOf(editorName) !== -1;
};
const testRule = (rule = {}, values = {}) => {
    if (Object.keys(rule).length > 0) {
        return Object.keys(rule).reduce( (p, c) => {
            const r = new RegExp(rule[c]);
            return p && r.test(values[c]);
        }, true);
    }
    return false;
};
const getEditor = (type, name, props) => {
    if (Editors[name]) {
        if (Editors[name][type]) {
            return Editors[name][type](props);
        }
        if (Editors[name].defaultEditor) {
            return Editors[name].defaultEditor(props);
        }
    }
    return null;
};
export const get = () => Editors;
export const register = ({name, editors}) => {
    if (!!editors) {
        Editors[name] = editors;
    }
};
export const remove = (name) => {
    if (isPresent(name)) {
        try {
            delete Editors[name];
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
};
export const clean = () => {
    Editors = {};
};
export const getCustomEditor = ({attribute, url, typeName}, rules = [], {type, props}) => {
    const editor = find(rules, (r) => testRule(r.regex, {attribute, url, typeName }));
    if (!!editor) {
        return getEditor(type, editor.editor, {...props, ...editor.editorProps || {}});
    }
    return null;
};


export default {
    get,
    register,
    remove,
    clean,
    getCustomEditor
};
