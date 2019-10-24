/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const START_TUTORIAL = 'START_TUTORIAL';
export const INIT_TUTORIAL = 'INIT_TUTORIAL';
export const SETUP_TUTORIAL = 'SETUP_TUTORIAL';
export const UPDATE_TUTORIAL = 'UPDATE_TUTORIAL';
export const DISABLE_TUTORIAL = 'DISABLE_TUTORIAL';
export const RESET_TUTORIAL = 'RESET_TUTORIAL';
export const CLOSE_TUTORIAL = 'CLOSE_TUTORIAL';
export const TOGGLE_TUTORIAL = 'TOGGLE_TUTORIAL';

export function startTutorial() {
    return {
        type: START_TUTORIAL
    };
}

export function initTutorial(id, steps, style, checkbox, defaultStep, presetList) {
    return {
        type: INIT_TUTORIAL,
        id,
        steps,
        style,
        checkbox,
        defaultStep,
        presetList
    };
}

export function setupTutorial(id, steps, style, checkbox, defaultStep, stop) {
    return {
        type: SETUP_TUTORIAL,
        id,
        steps,
        style,
        checkbox,
        defaultStep,
        stop
    };
}

export function updateTutorial(tour, steps) {
    return {
        type: UPDATE_TUTORIAL,
        tour,
        steps
    };
}

export function disableTutorial() {
    return {
        type: DISABLE_TUTORIAL
    };
}


export function resetTutorial() {
    return {
        type: RESET_TUTORIAL
    };
}

export function closeTutorial() {
    return {
        type: CLOSE_TUTORIAL
    };
}

export function toggleTutorial() {
    return {
        type: TOGGLE_TUTORIAL
    };
}
