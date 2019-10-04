/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Utils for geostory
 */

import { isArray, values, filter, merge } from 'lodash';
import uuid from 'uuid';

export const EMPTY_CONTENT = "EMPTY_CONTENT";
// Allowed StoryTypes
export const StoryTypes = {
    CASCADE: 'cascade'
};
// Allowed types
export const SectionTypes = {
    TITLE: 'title',
    PARAGRAPH: 'paragraph',
    IMMERSIVE: 'immersive'
};
/**
 * Allowed contents
 */
export const ContentTypes = {
    TEXT: 'text',
    MEDIA: 'media',
    COLUMN: 'column' // can have contents of type 'text' or 'media'
};

// Templates for contents that can be created using getDefaultSectionTemplate
export const SectionTemplates = {
    MEDIA: 'template-media'
};

export const MediaTypes = {
    IMAGE: 'image',
    MAP: 'map',
    VIDEO: 'video'
};
export const Modes = {
    EDIT: 'edit',
    VIEW: 'view'
};

export const Controls = {
    SHOW_SAVE: 'save.show',
    LOADING: 'loading'
};

export const SourceTypes = {
    GEOSTORY: 'geostory',
    GEOSTORE: 'geostore'
};
export const lists = {
    StoryTypes: values(StoryTypes),
    SectionTypes: values(SectionTypes),
    MediaTypes: values(MediaTypes),
    Modes: values(Modes)
};

export const defaultLayerMapPreview = {
    type: 'osm',
    title: 'Open Street Map',
    name: 'mapnik',
    source: 'osm',
    group: 'background',
    visibility: true,
    id: 'mapnik__0',
    loading: false,
    loadingError: false
};

/**
 * Return a class name from props of a content
 * @prop {string} theme one of 'bright', 'dark', 'dark-transparent' or 'bright-transparent'
 * @prop {string} align one of 'center', 'left' or 'right'
 * @prop {string} size one of 'full', 'large', 'medium' or 'small'
 */
export const getClassNameFromProps = ({ theme = 'bright', align = 'center', size = 'full' }) => {
    const themeClassName = ` ms-${theme}`;
    const alignClassName = ` ms-align-${align}`;
    const sizeClassName = ` ms-size-${size}`;
    return `${themeClassName}${alignClassName}${sizeClassName}`;
};

/**
 * tells if an element is a paragraph and it contains a media
 * @param {object} element
 * @return {boolean}
 */
export const isMediaSection = (element) => element.type === SectionTypes.PARAGRAPH &&
    element &&
    isArray(element.contents) &&
    element.contents.length &&
    isArray(element.contents[0].contents) &&
    element.contents[0].contents.length &&
    element.contents[0].contents[0].type === ContentTypes.MEDIA;

/**
 * utility function that scrolls the view to the element
 * @param {string} id id of the dom element
 * @param {object|boolean} scrollOptions options used to the scroll action
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
 */
export const scrollToContent = (id, scrollOptions) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView(scrollOptions);
    }
};


export const DEFAULT_MAP_OPTIONS = {
    zoomControl: true,
    style: {width: "100%", height: "100%"},
    mapOptions: {
        interactions: {
            mouseWheelZoom: false
        }
    }
};

/**
 * generate map defaults
 * @param {object} options to merge with defaults
 * @return {object} options merged with defaults
 */
export const applyDefaults = (options = {}) => merge({}, options, DEFAULT_MAP_OPTIONS);
/**
 * create map object
 * @param {object} baseMap initial map object
 * @param {object} overrides object to override with
 * @return {object} options merged with defaults
 */
export const createMapObject = (baseMap = {}, overrides = {}) => {
    return merge({}, baseMap, overrides);
};
/**
 * check if a string matches a regex
 * @param {string} title string to test
 * @param {string} filterText used to generate regex
 * @param {RegExp} [regex] used to test input string, default it uses the filterText
 * @return {boolean} true if it matches, false otherwise
 */
export const testRegex = (title, filterText, regex = RegExp(filterText, "i")) => {
    return filterText ? regex.test(title) : true;
};
/**
 * filter resources based on their title and a filter string
 * @param {object[]} resources resources to filter
 * @param {string} filterText string used to generate regex
 * @param {RegExp} [regex] regex used to test input string, default it uses the filterText
 * @return {object[]} filtered resources
 */
export const filterResources = (resources = [], filterText, regex = RegExp(filterText, "i") ) => {
    return filter(resources, r => testRegex(r.data && r.data.title, filterText, regex));
};
/**
 * Creates a default template for the given type
 * @param {string} type can be section type, a content type or a template (custom. i.e. paragraph with initial image for add media)
 * @return {object} the template object of the content/section
 */
export const getDefaultSectionTemplate = (type, localize = v => v) => {
    switch (type) {
    case SectionTypes.TITLE:
        return {
            id: uuid(),
            type: SectionTypes.TITLE,
            title: localize("geostory.builder.defaults.titleTitle"),
            cover: false,
            contents: [
                {
                    id: uuid(),
                    type: ContentTypes.TEXT,
                    html: '',
                    size: 'large',
                    align: 'center',
                    theme: 'bright',
                    background: {
                        fit: 'cover',
                        theme: 'bright',
                        size: 'full',
                        align: 'center'
                    }
                }
            ]
        };
    case SectionTypes.PARAGRAPH:
        return {
            id: uuid(),
            type: SectionTypes.PARAGRAPH,
            title: localize("geostory.builder.defaults.titleParagraph"),
            contents: [
                {
                    id: uuid(),
                    type: ContentTypes.COLUMN,
                    size: 'full',
                    align: 'center',
                    contents: [{
                        id: uuid(),
                        type: ContentTypes.TEXT,
                        html: ''
                    }]
                }
            ]
        };
    case SectionTypes.IMMERSIVE:
        return {
            id: uuid(),
            type: SectionTypes.IMMERSIVE,
            title: localize("geostory.builder.defaults.titleImmersive"),
            contents: [getDefaultSectionTemplate(ContentTypes.COLUMN, localize)]
        };
    case SectionTemplates.MEDIA: {
        return {
            id: uuid(),
            type: SectionTypes.PARAGRAPH,
            title: localize("geostory.builder.defaults.titleMedia"),
            contents: [
                {
                    id: uuid(),
                    type: ContentTypes.COLUMN,
                    contents: [{
                        id: uuid(),
                        type: ContentTypes.MEDIA,
                        size: 'medium',
                        align: 'center'
                    }]
                }
            ]
        };
    }
    case ContentTypes.COLUMN: {
        return {
            id: uuid(),
            type: ContentTypes.COLUMN,
            align: 'left',
            size: 'small',
            theme: 'bright',
            contents: [{
                id: uuid(),
                type: ContentTypes.TEXT,
                html: ''
            }],
            background: {
                fit: 'cover',
                size: 'full',
                align: 'center',
                theme: 'bright'
            }
        };
    }
    case ContentTypes.TEXT: {
        return {
            id: uuid(),
            type: ContentTypes.TEXT,
            html: ''
        };
    }
    default:
        return {
            id: uuid(),
            type,
            title: localize("geostory.builder.defaults.titleUnknown")
        };
    }
};
