/**
* Copyright 2016, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import { connect } from 'react-redux';

import { setVectorStyleParameter } from '../../actions/vectorstyler';
import ScaleDenominator from '../../components/style/ScaleDenominator';
import StylePointComp from '../../components/style/StylePoint';
import StylePolygonComp from '../../components/style/StylePolygon';
import StylePolylineComp from '../../components/style/StylePolyline';
import { symbolselector } from '../../selectors/vectorstyler';

const StylePolygon = connect(symbolselector, {
    setStyleParameter: setVectorStyleParameter.bind(null, 'symbol')
})(StylePolygonComp);

const StylePoint = connect(symbolselector, {
    setStyleParameter: setVectorStyleParameter.bind(null, 'symbol')
})(StylePointComp);

const StylePolyline = connect(symbolselector, {
    setStyleParameter: setVectorStyleParameter.bind(null, 'symbol')
})(StylePolylineComp);


export default {
    StylePolygon,
    StylePolyline,
    StylePoint,
    ScaleDenominator
};
