/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { compose, withHandlers, withPropsOnChange, withState } from 'recompose';

/**
 * Use this enhancer if you want to change step and use setPage as handler
 */
export const wizardHandlers = compose(
    withPropsOnChange(["step"], ({skipButtonsOnSteps = [], step, hideButtons} = {}) => {
        if (skipButtonsOnSteps && skipButtonsOnSteps.indexOf(step) >= 0) {
            return {hideButtons: true};
        }
        return {hideButtons};
    }),
    withHandlers({
        onNextPage: ({step, setPage = () => {}}) => () => {
            setPage(step + 1);
        },
        onPrevPage: ({step, setPage = () => {}}) => () => {
            setPage(Math.max(step - 1, 0));
        }
    })
);
    /**
    * Apply this enhancer to the WizardContainer to make it controlled.
    * It controls the step and the hideButtons properties
    */
export const controlledWizard = compose(
    withState(
        "step", "setPage", 0
    ),
    wizardHandlers
);
