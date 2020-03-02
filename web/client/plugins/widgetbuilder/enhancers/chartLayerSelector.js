/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { connect } from 'react-redux';

import { compose, defaultProps, withProps, setDisplayName } from 'recompose';
import layerSelector from './layerSelector';
import { onEditorChange } from '../../../actions/widgets';
import canGenerateCharts from '../../../observables/widgets/canGenerateCharts';
export default compose(
    setDisplayName('ChartLayerSelector'),
    connect(() => ({}), {
        onLayerChoice: (l) => onEditorChange("layer", l),
        onResetChange: onEditorChange
    }),
    defaultProps({
        layerValidationStream: stream$ => stream$.switchMap(layer => canGenerateCharts(layer))
    }),
    // add button to back to widget type selection
    withProps(({ onResetChange = () => { } }) => ({
        stepButtons: [{
            glyph: 'arrow-left',
            tooltipId: "widgets.builder.wizard.backToWidgetTypeSelection",
            onClick: () => {
                // options will not be valid anymore in case of layer change
                onResetChange("options", undefined);
                onResetChange("widgetType", undefined);
            }
        }]
    })),
    layerSelector
);
