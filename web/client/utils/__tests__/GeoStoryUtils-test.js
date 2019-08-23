/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import expect from"expect";
import { values, isArray } from "lodash";
import uuid from 'uuid';

import {
    StoryTypes,
    SectionTypes,
    ContentTypes,
    MediaTypes,
    Modes,
    lists,
    SAMPLE_HTML,
    getDefaultSectionTemplate
} from "../GeoStoryUtils";


describe("GeoStory", () => {
    beforeEach( () => {

    });
    afterEach((done) => {
        document.body.innerHTML = "";
        setTimeout(done);
    });
    it("test StoryTypes", () => {
        expect(StoryTypes).toEqual({
            CASCADE: "cascade"
        });
    });
    it("test SectionTypes", () => {
        expect(SectionTypes).toEqual({
            TITLE: "title",
            PARAGRAPH: "paragraph",
            IMMERSIVE: "immersive"
        });
    });
    it("test ContentTypes", () => {
        expect(ContentTypes).toEqual({
            TEXT: "text",
            MEDIA: "media",
            COLUMN: "column"
        });
    });
    it("test MediaTypes", () => {
        expect(MediaTypes).toEqual({
            IMAGE: "image",
            VIDEO: "video"
        });
    });
    it("test Modes", () => {
        expect(Modes).toEqual({
            EDIT: "edit",
            VIEW: "view"
        });
    });
    it("lists", () => {
        expect(lists).toEqual({
            StoryTypes: values(StoryTypes),
            SectionTypes: values(SectionTypes),
            MediaTypes: values(MediaTypes),
            Modes: values(Modes)
        });
    });
    it("test SAMPLE_HTML", () => {
        expect(SAMPLE_HTML).toBe("<p>insert text here...</p>");
    });
    describe("getDefaultSectionTemplate", () => {
        it("SectionTypes.TITLE", () => {
            const data = getDefaultSectionTemplate(SectionTypes.TITLE);
            expect(data.id).toNotExist();
            expect(data.type).toBe(SectionTypes.TITLE);
            expect(data.title).toBe("Title Section");
            expect(data.cover).toBe(false);
            expect(isArray(data.contents)).toBe(true);
            const content = data.contents[0];
            expect(content.id.length).toBe(uuid().length);
            expect(content.type).toBe(ContentTypes.TEXT);
            expect(content.html).toBe(`<h1 style="text-align:center;">Insert Title</h1><p style="text-align:center;"><em>sub title</em></p>`);
            expect(content.size).toBe("large");
            expect(content.align).toBe("center");
            expect(content.theme).toBe("bright");
        });
        // TODO wait for testing the getDefaultSectionTemplate because it's a wip
        // and needs to be finalized with a load mechanism
    });

});
