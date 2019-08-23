/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { values } from "lodash";
import uuid from 'uuid';


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
// Allowed contents
export const ContentTypes = {
    TEXT: 'text',
    MEDIA: 'media',
    COLUMN: 'column' // can have contents of type 'text' or 'media'
};
export const MediaTypes = {
    IMAGE: 'image',
    VIDEO: 'video'
};
export const Modes = {
    EDIT: 'edit',
    VIEW: 'view'
};
export const lists = {
    StoryTypes: values(StoryTypes),
    SectionTypes: values(SectionTypes),
    MediaTypes: values(MediaTypes),
    Modes: values(Modes)
};

export const SAMPLE_HTML = "<p>insert text here...</p>";

/**
 * creates a default template
 * @param {string} type can be section type or content type
 * @return {object} the template
 */
export const getDefaultSectionTemplate = (type) => {
    switch (type) {
        case SectionTypes.TITLE:
            return {
                type: SectionTypes.TITLE,
                title: 'Title Section', // TODO I18N
                cover: false,
                contents: [
                    {
                        id: uuid(),
                        type: ContentTypes.TEXT,
                        html: `<h1 style="text-align:center;">Insert Title</h1><p style="text-align:center;"><em>sub title</em></p>`, // TODO I18N
                        size: 'large',
                        align: 'center',
                        theme: 'bright'
                    }
                ]
            };
        case SectionTypes.PARAGRAPH:
            return {
                id: uuid(),
                type: SectionTypes.PARAGRAPH,
                title: 'Paragraph Section', // TODO I18N
                contents: [
                    {
                        id: uuid(),
                        type: ContentTypes.COLUMN,
                        contents: [{
                            id: uuid(),
                            type: ContentTypes.TEXT,
                            html: SAMPLE_HTML
                        }]
                    }
                ]
            };
        case SectionTypes.IMMERSIVE:
            return {
                id: uuid(),
                type: SectionTypes.IMMERSIVE,
                title: "Immersive Section", // TODO I18N
                contents: [getDefaultSectionTemplate(ContentTypes.COLUMN)]
            };
        case ContentTypes.COLUMN: {
            return {
                id: uuid(),
                type: ContentTypes.COLUMN,
                contents: [{
                    id: uuid(),
                    type: ContentTypes.TEXT,
                    html: SAMPLE_HTML
                }],
                background: {
                    type: "image",
                    fit: 'cover'

                },
                align: 'left',
                size: 'medium'
            };
        }
        case ContentTypes.TEXT: {
            return {
                id: uuid(),
                type: ContentTypes.TEXT,
                html: SAMPLE_HTML
            };
        }
        default:
            return {
                id: uuid(),
                type,
                title: "UNKNOWN" // TODO I18N
            };
    }
};
